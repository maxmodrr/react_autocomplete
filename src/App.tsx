import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

function filterPerson(arr: Person[], query: string) {
  return query ? [...arr].filter(elem => elem.name.includes(query)) : [...arr];
}

export const App: React.FC = () => {
  const [value, setValue] = useState('');
  const [appliedValue, setAppliedValue] = useState('');
  const [title, setTitle] = useState('No selected person');

  const [showArray, setShowArray] = useState(false);
  const timerId = useRef(0);
  const showMessageRef = useRef(false);

  const updatedPersons = useMemo(() => {
    return filterPerson(peopleFromServer, appliedValue);
  }, [appliedValue]);

  const handleChangeInputName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
      setTitle('No selected person');
      window.clearTimeout(timerId.current);

      timerId.current = window.setTimeout(() => {
        setAppliedValue(!!event.target.value ? event.target.value : '');
      }, 300);
    },
    [],
  );

  const handleFocus = () => {
    if (!value) {
      setAppliedValue('');
    }

    setShowArray(true);
    showMessageRef.current = false;
  };

  const handleBlur = () => {
    if (!value) {
      setShowArray(false);
      showMessageRef.current = true;
    }
  };

  useEffect(() => {
    if (appliedValue && updatedPersons.length > 0) {
      const { name, born, died } = updatedPersons[0];

      setTitle(`${name} (${born} - ${died})`);
      setShowArray(true);
      showMessageRef.current = false;
    } else if (appliedValue && updatedPersons.length === 0) {
      setShowArray(false);
      showMessageRef.current = true;
    } else if (!appliedValue && showArray) {
      setTitle('No selected person');
      setShowArray(true);
      showMessageRef.current = false;
    }
  }, [appliedValue, updatedPersons, showArray]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={value}
              onChange={handleChangeInputName}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {showArray && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {updatedPersons.map(people => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={people.name}
                  >
                    <p className="has-text-link">{people.name}</p>
                  </div>
                ))}
                {/* <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter Bernard Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter Antone Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Elisabeth Haverbeke</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">Pieter de Decker</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Petronella de Decker</p>
              </div>

              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-danger">Elisabeth Hercke</p>
              </div> */}
              </div>
            </div>
          )}
        </div>

        {showMessageRef.current && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
