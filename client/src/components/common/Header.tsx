import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Navbar>
      <Nav>
        <NavItem>
          <Link to="/">Code Pair</Link>
        </NavItem>
      </Nav>
    </Navbar>
  );
};

export default Header;
