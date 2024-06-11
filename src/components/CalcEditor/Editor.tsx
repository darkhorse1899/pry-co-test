import React, { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';

import useInputStore from '@/store/useInputStore';
import { Factor, FactorType } from '@/store/useCalcStore';
import { Autocomplete } from '@/types/autocomplete';
import classes from './Editor.module.scss';

interface FormulaEditorProps {
  expressions: Factor[];
  setExpressions: (_: Factor[]) => void;
}

const isOperator = (str: string) => ['+', '-', '*', '/'].includes(str[0]);
const isDigit = (str: string) => [...Array(10).keys()].map(i => `${i}`).includes(str[0]);

const FormulaEditor: React.FC<FormulaEditorProps> = ({ expressions: _expressions, setExpressions: _setExpressions }) => {
  const [code, setCode] = useState<string>('');
  const [iscomplete, setIscomplete] = useState<boolean>(false);
  const [isrendering, setIsrendering] = useState<boolean>(true);
  const [expressions, setExpressions] = useState<Factor[]>(_expressions);
  const { inputs: autocompletes } = useInputStore();
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    const initialCode =
      expressions.map(exp => {
        if (exp.type === FactorType.WIDGET) {
          return `{{widget:${exp.id}}}`;
        } else {
          return exp.value;
        }
      }).join('');
    setCode(initialCode);
  }, [expressions]);

  useEffect(() => {
    if (!editorRef.current || isrendering) return;

    const editor = editorRef.current.editor;
    setTimeout(() => {
      const widgetList = expressions.filter(item => item.type === FactorType.WIDGET);

      widgetList.forEach(widget => {
        const placeholder = `{{widget:${widget.id}}}`;
        const doc = editor.getDoc();
        const text = doc.getValue();
        let index = 0;

        while ((index = text.indexOf(placeholder, index)) !== -1) {
          const from = doc.posFromIndex(index);
          const to = doc.posFromIndex(index + placeholder.length);

          const widgetDom = document.createElement('span');
          widgetDom.className = 'cm-widget';
          widgetDom.innerHTML = widget.value;

          editor.markText(from, to, {
            replacedWith: widgetDom,
          });

          index += placeholder.length;
        }
      });
    }, 100);
  }, [isrendering, expressions]);

  useEffect(() => {
    if (!editorRef.current || !iscomplete) return;
    const editor = editorRef.current.editor;

    const cur = editor.getCursor();
    const token = editor.getTokenAt(cur);
    const start = token.start;
    const end = cur.ch;
    const word = token.string;

    if (word.length > 1) {
      const hintsList: Autocomplete[] = autocompletes || [];
      editor.showHint({
        hint: () => ({
          list: hintsList.map((item) => ({
            text: item.id,
            displayText: item.name,
            from: { ch: start, line: cur.line },
            to: { ch: end, line: cur.line },
          })),
          from: { ch: start, line: cur.line },
          to: { ch: end, line: cur.line },
        }),
      });
    }
  }, [iscomplete, autocompletes]);

  const handleBeforeChange = useCallback((editor: any, data: any, value: string) => {
    if (data.origin === '+input' && data.text.length === 1) {
      const type = isOperator(data.text)
        ? FactorType.OPERATOR : isDigit(data.text)
          ? FactorType.NUMBER : FactorType.VARIABLE;
      const newExp = { id: `${Date.now()}`, type, value: data.text };

      const lastExp = expressions.length > 0 ? expressions[expressions.length - 1] : null;
      if (!lastExp) {
        setExpressions([...expressions, newExp]);
      } else if (lastExp && lastExp.type === FactorType.VARIABLE && lastExp.value.length > 0) {
        setIscomplete(true);
      } else if (lastExp.type === type) {
        setExpressions(expressions.map(
          item => item.id === lastExp.id ? { ...item, value: `${lastExp.value}${data.text}` } : item
        ));
      } else {
        setExpressions([...expressions, newExp]);
      }
    } else if (data.origin === '+delete') {
      const from = data.from.ch, to = data.to.ch;
      let sliceExps = [...expressions];
      for (let i = to; i > from; i--) {
        const lastExp = sliceExps.length > 0 ? sliceExps[sliceExps.length - 1] : null;
        if (lastExp) {
          if (lastExp.type === FactorType.WIDGET || lastExp.value.length === 1)
            sliceExps = [...sliceExps.filter(item => item.id !== lastExp.id)];
          else sliceExps = [...sliceExps.map(item =>
            item.id === lastExp.id ? { ...item, value: item.value.slice(0, item.value.length - 1) } : item
          )];
        }
      }
      setExpressions(sliceExps);
    } else if (data.origin === 'complete') {
      const completeItem = autocompletes?.find(item => item.id === data.text.toString());
      const lastExp = expressions.length > 0 ? expressions[expressions.length - 1] : null;
      setExpressions([
        ...expressions.filter(item => item.id !== lastExp?.id),
        { id: `${Date.now()}`, variableID: completeItem?.id, type: FactorType.WIDGET, value: completeItem?.name || '' }
      ]);
      setIscomplete(false);
    }
    setCode(value);
    setIsrendering(true);
  }, [expressions]);

  const handleChange = (editor: any, data: any, value: string) => {
    setIsrendering(false);
  };

  return (
    <CodeMirror
      ref={editorRef}
      value={code}
      options={{
        mode: 'javascript',
        lineNumbers: false,
        lineWrapping: false,
        scrollbarStyle: 'null',
        extraKeys: { 'Enter': false },
      }}
      onBeforeChange={handleBeforeChange}
      onChange={handleChange}
      className={classes.root}
    />
  );
};

export default FormulaEditor;
