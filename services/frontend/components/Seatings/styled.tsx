import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 5px;
`;

export const Screen = styled.div`
  width: 80%;
  height: 20px;
  box-sizing: content-box;

  font-weight: 700;
  background-color: var(--bs-secondary);
  color: var(--bs-white);
  border-radius: 5px;
  margin-bottom: 10px;
  text-align: center;
  text-transform: uppercase;
  font-size: 0.8rem;
  padding: 5px 10px;
`;

export const SeatRow = styled.div`
  display: flex;
  justify-content: center;
  column-gap: 5px;
  overflow-x: scroll;
`;
