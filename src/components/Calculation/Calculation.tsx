import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { ChevronDown, ChevronRight, LucideEdit } from 'lucide-react';

import CalcEditor from '../CalcEditor';
import { Factor } from '@/store/useCalcStore';

import classes from './Calculation.module.scss';

interface CalculationProps {
	name: string;
	expressions: Factor[];
	updateName: (_: string) => void;
	updateExps: (_: Factor[]) => void;
}

function Calculation({
	name,
	expressions,
	updateName,
	updateExps
}: CalculationProps) {
	const [isExpand, setIsExpand] = useState(false);
	const [isNameEditing, setIsNameEditing] = useState(false);
	const [formulaName, setFormulaName] = useState<string>(name);

	const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFormulaName(e.target.value);
	}

	const onTitleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			updateName(formulaName);
			setIsNameEditing(false);
		}
	}

	return <div className={classes.root}>
		<div className={classes.header}>
			<button onClick={() => setIsExpand(!isExpand)}>
				{isExpand ? <ChevronDown /> : <ChevronRight />}
			</button>
			<div className={classes.title}>
				{isNameEditing
					? <input
						value={formulaName}
						onChange={onTitleChange}
						onKeyDown={onTitleKeyDown}
					/>
					: <p onClick={() => setIsNameEditing(true)}>{name}</p>}
			</div>
			<button className={classes.editBtn} onClick={() => setIsNameEditing(true)}>
				<LucideEdit />
			</button>
		</div>
		<div className={classes.result}>
			<p>0</p>
		</div>
		{
			isExpand && <div className={classes.editor}>
				<CalcEditor expressions={expressions} setExpressions={updateExps} />
			</div>
		}
	</div >
}

export default Calculation;