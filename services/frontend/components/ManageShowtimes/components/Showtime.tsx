import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const DateTime = styled.div`
  border: 1px solid var(--bs-primary);
  border-radius: 10px;
  padding: 5px 10px;
`;

interface Props {
  showtime: SilverVillage.Showtime;
  onDelete: (showtimeId: number) => void;
}

const Showtime: React.FC<Props> = function (props) {
  const { showtime, onDelete } = props;

  const handleDeleteClick: React.MouseEventHandler = (e) => {
    onDelete(showtime.id);
  };

  return (
    <Wrapper>
      <DateTime>{moment(showtime.start).format('(D MMM) ddd h:mm A')}</DateTime>
      &nbsp;to&nbsp;
      <DateTime>{moment(showtime.end).format('(D MMM) ddd h:mm A')}</DateTime>
      <button onClick={handleDeleteClick}>Delete</button>
    </Wrapper>
  );
};

export default Showtime;
