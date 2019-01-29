import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import $ from 'jquery'
import _ from 'lodash'

import Header from './header'
import './layout.css'

//embrace the cascade
import 'normalize.css'
import 'bootstrap/dist/css/bootstrap.css'

class Layout extends React.Component {
  // oh no baby what is you doing
  componentDidMount() {
    const $link = $(this.container).find('header h1 a')

    const upper = _.join(
      _.map($link.text().split(' '), part => part.toUpperCase()),
      ' '
    )

    $link.text(upper)
  }

  render() {
    const { children } = this.props

    return (
      <StaticQuery
        query={graphql`
          query SiteTitleQuery {
            site {
              siteMetadata {
                title
              }
            }
          }
        `}
        render={data => (
          <div ref={node => (this.container = node)}>
            <Header siteTitle={data.site.siteMetadata.title} />
            <div
              style={{
                margin: `0 auto`,
                maxWidth: 960,
                padding: `0px 1.0875rem 1.45rem`,
                paddingTop: 0,
              }}
            >
              <div className="alert alert-primary" role="alert">
                Welcome to my site!
              </div>
              {children}
              <footer>
                © {new Date().getFullYear()}, Built with
                {` `}
                <a href="https://www.gatsbyjs.org">Gatsby</a>
              </footer>
            </div>
          </div>
        )}
      />
    )
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
