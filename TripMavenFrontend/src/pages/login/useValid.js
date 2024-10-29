import { useState } from 'react';

const useValid = (initialState, validate) => {
    const [value, setValue] = useState(initialState);
    const [error, setError] = useState('');

    const onChange = (e) => {
        const { value } = e.target;
        setValue(value);
        if (validate) {
            setError(validate(value));
        }
    };

    return {
        value,
        onChange,
        error,  
        setValue,
        setError
    };
};

export default useValid;
