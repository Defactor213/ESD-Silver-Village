import { groupBy } from 'lodash';
import React, { useCallback, useMemo } from 'react';

import Seat from './components/Seat';
import { Screen, SeatRow, Wrapper } from './styled';

interface Props {
  seatings: SilverVillage.Seating[];
  freeIds: Set<number>;
  bookedIds: Set<number>;
  chosenSeatIds: Set<SilverVillage.Seating['seatid']>;
  onChosenSeatsChange: (
    chosenSeatIds: Set<SilverVillage.Seating['seatid']>
  ) => void;
}

const Seatings: React.FC<Props> = function (props) {
  const { seatings, freeIds, bookedIds, onChosenSeatsChange, chosenSeatIds } =
    props;

  const handleSeatToggle = useCallback(
    (seat: SilverVillage.Seating) => {
      if (bookedIds.has(seat.seatid)) {
        return;
      }

      const clonedSet = new Set(chosenSeatIds);

      if (chosenSeatIds.has(seat.seatid)) {
        clonedSet.delete(seat.seatid);
      } else {
        clonedSet.add(seat.seatid);
      }
      onChosenSeatsChange(clonedSet);
    },
    [bookedIds, chosenSeatIds, onChosenSeatsChange]
  );

  const seatsGrouped = useMemo(() => {
    return groupBy(seatings, 'seatrow');
  }, [seatings]);

  return (
    <Wrapper>
      <h4 className="text-primary fw-bold">Choose your seat(s)</h4>
      <Screen>Screen</Screen>
      {seatings.length === 0 && (
        <span className="text-secondary">
          There are no seats for this showtime.
        </span>
      )}
      {Object.entries(seatsGrouped).map(([seatRow, seats]) => (
        <SeatRow key={seatRow}>
          {seats.map((seat) => {
            let state: 'chosen' | 'booked' | 'free' = 'free';
            if (chosenSeatIds.has(seat.seatid)) {
              state = 'chosen';
            } else if (freeIds.has(seat.seatid)) {
              state = 'free';
            } else if (bookedIds.has(seat.seatid)) {
              state = 'booked';
            }

            return (
              <Seat
                key={seat.seatid}
                seating={seat}
                onClick={handleSeatToggle}
                state={state}
              />
            );
          })}
        </SeatRow>
      ))}
    </Wrapper>
  );
};

export default Seatings;
