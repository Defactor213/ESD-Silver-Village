import classNames from 'classnames';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

interface Props {
  className?: string;
  href: string;
}

const Link: React.FC<Props> = function (props) {
  const { href, children, className } = props;

  const router = useRouter();

  const active = router.pathname === href;

  return (
    <NextLink href={href} passHref>
      <a
        className={classNames(className, 'nav-link', { active })}
        aria-current={active ? 'page' : undefined}
      >
        {children}
      </a>
    </NextLink>
  );
};

export default Link;
