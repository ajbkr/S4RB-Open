import axios from 'axios'
import React, { Component } from 'react'
import Table from 'react-bootstrap/Table'

class CPMU extends Component {
  constructor (props) {
    super(props)

    this.state = {
      data: []
    }
  }

  componentDidMount () {
    axios.get('http://localhost:3001/api/cpmu/json')
      .then(res => {
        const { data } = res

        this.setState({ data })
      })
  }

  render () {
    const { data } = this.state

    return (
      <>
        <h4><label htmlFor='cpmu'>Complaints per million units</label></h4>
        <Table id='cpmu' size='sm'>
          <thead>
            <tr>
              <th>Month</th>
              <th>CPMU</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ CPMU: cpmu, Month: month }, key) =>
              <tr key={key}>
                <td>{month}</td>
                <td>{cpmu}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </>
    )
  }
}

export default CPMU
