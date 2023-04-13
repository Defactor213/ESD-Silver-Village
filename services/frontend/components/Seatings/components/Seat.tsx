import React from 'react';
import styled, { css } from 'styled-components';

const Wrapper = styled.div<{ $state: Props['state'] }>`
  display: flex;
  align-items: center;

  border: 2px solid var(--bs-primary);
  color: var(--bs-primary);
  border-radius: 4px;
  padding: 2px 4px;
  font-weight: 700;
  font-size: 0.8rem;

  &:hover {
    cursor: pointer;
    color: var(--bs-white);
    background: var(--bs-primary);
  }

  ${(props) => {
    switch (props.$state) {
      case 'chosen': {
        return css`
          background: var(--bs-primary);
          color: var(--bs-white);
        `;
      }
      case 'booked': {
        return css`
          opacity: 0.5;
        `;
      }
    }
  }}
`;

interface Props {
  seating: SilverVillage.Seating;
  onClick: (seating: SilverVillage.Seating) => void;
  state: 'chosen' | 'booked' | 'free';
}

const Seat: React.FC<Props> = function (props) {
  const { seating, onClick, state } = props;

  const handleClick: React.MouseEventHandler = () => {
    onClick(seating);
  };

  return (
    <Wrapper onClick={handleClick} $state={state}>
      {seating.seatrow}&nbsp;{seating.seatnumber}
    </Wrapper>
  );
};

export default Seat;
