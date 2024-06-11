import { useEffect } from 'react';

import Calculation from '@/components/Calculation';
import useCalcStore from '@/store/useCalcStore';
import useInputStore from '@/store/useInputStore';
import { useAutocompletesQuery } from '@/services/queries/autocomplete.query';

import classes from './Home.module.scss';

function Home() {
  const { calculations, updateName, updateExps } = useCalcStore();
  const { loadInputs } = useInputStore();
  const { isLoading, data } = useAutocompletesQuery({});

  useEffect(() => {
    if (!isLoading && data) {
      loadInputs(data);
    }
  }, [isLoading, data]);

  return <div className={classes.root}>
    {calculations.map(item =>
      <Calculation
        key={item.name}
        updateName={updateName(item.name)}
        updateExps={updateExps(item.name)}
        {...item}
      />
    )}
  </div>
}

export default Home;
