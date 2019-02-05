import React from 'react'
import { Link } from 'gatsby'
import axios from 'axios'
import $ from 'jquery'

import Layout from '../components/layout'
import Image from '../components/image'
import SEO from '../components/seo'

class IndexPage extends React.Component {
  async componentDidMount() {
    const image = await axios.get('https://dog.ceo/api/breeds/image/random')
      .then(res => res.data.message)
    $(this.image).attr('src', image)
  }

  render() {
    return (
      <Layout>
        <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
        <h1>Hi people</h1>
        <img title="A cute dog hopefully!" ref={ref => this.image = ref} />
        <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
          <Image />
        </div>
        <Link to="/page-2/">Go to page 2</Link>
      </Layout>
    )
  }
}

export default IndexPage
