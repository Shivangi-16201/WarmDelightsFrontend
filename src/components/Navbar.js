import React, { useState } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartCount, clearCart } = useCart();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout(clearCart);
    setExpanded(false);
  };

  const closeNavbar = () => {
    setExpanded(false);
  };

  return (
    <BootstrapNavbar bg="white" expand="lg" fixed="top" className="navbar" expanded={expanded}>
      <Container>
        <LinkContainer to="/" onClick={closeNavbar}>
          <BootstrapNavbar.Brand className="fw-bold">
            <img 
              src="/images/Logo.jpg" 
              alt="Warm Delights Logo" 
              height="70" 
              width="auto" 
              className="navbar-logo me-2"
            />
          </BootstrapNavbar.Brand>
        </LinkContainer>
        
        <BootstrapNavbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={() => setExpanded(expanded ? false : true)}
        />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/" onClick={closeNavbar}>
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>

            {/* Menu Dropdown */}
            <NavDropdown title="Menu" id="menu-dropdown">
              <LinkContainer to="/menu" onClick={closeNavbar}>
                <NavDropdown.Item>Our Menu</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/custom-order" onClick={closeNavbar}>
                <NavDropdown.Item>Custom Order</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>

            <LinkContainer to="/gallery" onClick={closeNavbar}>
              <Nav.Link>Gallery</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/about" onClick={closeNavbar}>
              <Nav.Link>About</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/contact" onClick={closeNavbar}>
              <Nav.Link>Contact</Nav.Link>
            </LinkContainer>
          </Nav>
          
          <Nav>
            <LinkContainer to="/cart" onClick={closeNavbar}>
              <Nav.Link className="position-relative">
                <i className="fas fa-shopping-cart me-1"></i>
                Cart
                {getCartCount() > 0 && (
                  <Badge bg="primary" className="cart-badge">
                    {getCartCount()}
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>
            
            {isAuthenticated ? (
              /* User Dropdown when logged in */
              <NavDropdown 
                title={`Hello, ${user.name}`} 
                id="user-dropdown"
                align="end"
              >
                {user.role === 'admin' && (
                  <LinkContainer to="/admin" onClick={closeNavbar}>
                    <NavDropdown.Item>Admin</NavDropdown.Item>
                  </LinkContainer>
                )}
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              /* Login/Register when not authenticated */
              <>
                <LinkContainer to="/login" onClick={closeNavbar}>
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register" onClick={closeNavbar}>
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;