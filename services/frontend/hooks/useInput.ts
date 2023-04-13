import React, { useCallback, useMemo, useState } from 'react';

interface Props {
  value: string;
  onChange: React.ChangeEventHandler;
}

export default function useInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);

  const onChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setValue(e.target.value);
    },
    []
  );

  const props = useMemo<Props>(() => {
    return {
      value,
      onChange,
    };
  }, [onChange, value]);

  return {
    props,
  };
}
