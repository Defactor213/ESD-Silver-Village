import classNames from 'classnames';
import React from 'react';
import styled from 'styled-components';

import Link from './NavLink';

const Image = styled.img`
  object-fit: cover;
  height: 300px;
  pointer-events: none;
`;

const CarouselCaption = styled.div`
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
`;

interface Props {
  active?: boolean;
  imageSrc: string;
  title: string;
  description: string;
  link?: string;
  transitionTimeMs?: number;
}

const Promotion: React.FC<Props> = function (props) {
  const {
    active,
    imageSrc,
    title,
    description,
    link,
    transitionTimeMs = 10000,
  } = props;

  return (
    <div
      className={classNames('carousel-item', { active })}
      data-bs-interval={transitionTimeMs}
    >
      <Image src={imageSrc} alt="Promotional image" className="d-block w-100" />
      <CarouselCaption className="carousel-caption d-flex flex-column align-items-start text-start">
        <h3 className="fw-bold">{title}</h3>
        <p>{description}</p>
        {link != null && (
          <Link href={link} className="btn btn-primary text-white">
            Buy Now
          </Link>
        )}
      </CarouselCaption>
    </div>
  );
};

export default Promotion;
