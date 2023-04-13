import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  border-radius: 10px;

  border: 3px solid var(--bs-primary);
  background: var(--bs-primary);
  color: var(--bs-white);
  padding: 5px 10px;
  font-weight: 700;

  &:hover {
    background: var(--bs-white);
    color: var(--bs-primary);
  }
`;

interface Props {
  showtime: SilverVillage.Showtime;
}

const Showtime: React.FC<Props> = function (props) {
  const { showtime } = props;

  return (
    <Wrapper>{moment(showtime.start).format('(D MMM) ddd h:mm A')}</Wrapper>
  );
};

export default Showtime;
