import type { LinksFunction } from '@vercel/remix';
import { Form, NavLink, useSubmit } from '@remix-run/react'
import headerStylesheet from "~/styles/header.css"

import { useOptionalUser } from '~/utils';

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: headerStylesheet }];
};

const Header = () => {
  const user = useOptionalUser()
  const submit = useSubmit()
  const activeStyle = {
    color: "gray"
  }

  return (
    <nav>
      <div className="left">
        <NavLink
          to="/"
          className="bold"
          style={({ isActive }) =>
            isActive ? activeStyle : undefined
          }
        >
          Blog
        </NavLink>

        {user && <NavLink
          to="/drafts"
          style={({ isActive }) =>
            isActive ? activeStyle : undefined
          }
        >
          Drafts
        </NavLink>}
      </div>
      <div className="right">
        {user ?
          <>
            <NavLink to="/create" >
              + Create draft
            </NavLink>
            <Form method='POST' action='/logout'>
              <button type='submit' className='button'>Logout</button>
            </Form>
          </>
          :
          <>
            <NavLink to="/signup" >
              Signup
            </NavLink>
            <NavLink to="/login" >
              Login
            </NavLink>
          </>
        }
      </div>
    </nav>
  );
}

export default Header
