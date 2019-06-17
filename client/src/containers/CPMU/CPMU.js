import axios from 'axios'
import React, { Component } from 'react'
import Table from 'react-bootstrap/Table'

class CPMU extends Component {
  constructor (props) {
    super(props)

    this.state = {
      data: [],
      filterBy: 'Month',
      visibleData: []
    }

    this.handleChange = this.handleChange.bind(this)

    this.calculateVisibleData = this.calculateVisibleData.bind(this)
    this.filterDataByQuarter = this.filterDataByQuarter.bind(this)
  }

  componentDidMount () {
    axios.get('http://localhost:3001/api/cpmu/json')
      .then(res => {
        const { data } = res

        this.setState({ data, visibleData: data })
      })
  }

  render () {
    const { filterBy, visibleData } = this.state

    const formatCPMU = cpmu => cpmu !== 'No Value' && cpmu.toFixed(5)

    const formatMonth = month => {
      const millis = Date.parse(month)

      return !isNaN(millis)
        ? new Date(millis).toLocaleDateString('en-GB', {
          month: 'long',
          year: 'numeric'
        })
        : 'No Value'
    }

    return (
      <>
        <h4><label htmlFor='cpmu'>Complaints per million units</label></h4>
        <label htmlFor='filter-by'>Filter by:</label>
        <select id='filter-by' onChange={this.handleChange}>
          <option>Month</option>
          <option>Quarter</option>
        </select>
        {filterBy === 'Month' &&
          <Table id='cpmu' size='sm'>
            <thead>
              <tr>
                <th>Month</th>
                <th>CPMU</th>
              </tr>
            </thead>
            <tbody>
              {visibleData.map(({ CPMU: cpmu, Month: month }, key) =>
                <tr key={key}>
                  <td>{formatMonth(month)}</td>
                  <td>{formatCPMU(cpmu)}</td>
                </tr>
              )}
            </tbody>
          </Table>
        }
        {filterBy === 'Quarter' &&
          <Table id='cpmu' size='sm'>
            <thead>
              <tr>
                <th>Year</th>
                <th>Quarter</th>
                <th>CPMU</th>
              </tr>
            </thead>
            <tbody>
              {visibleData.map(({ CPMU: cpmu, Quarter: quarter, Year: year }, key) =>
                <tr key={key}>
                  <td>{year}</td>
                  <td>{quarter}</td>
                  <td>{cpmu}</td>
                </tr>
              )}
            </tbody>
          </Table>
        }
      </>
    )
  }

  handleChange (event) {
    const { value: filterBy } = event.target

    this.setState({ filterBy, visibleData: this.calculateVisibleData(filterBy) })
  }

  calculateVisibleData (filterBy) {
    const { data } = this.state

    switch (filterBy) {
      case 'Quarter':
        return this.filterDataByQuarter()
      default:
        return data
    }
  }

  filterDataByQuarter () {
    const { data } = this.state

    const years = []

    data.forEach(({ Month: month }) => {
      const year = new Date(month).getFullYear()

      if (!isNaN(year) && !years.includes(year)) {
        years.push(year)
      }
    })

    const sortedYears = years.sort()

    const visibleData = []

    sortedYears.forEach(year => {
      const quarters = []

      data.forEach(({ Month: month, Quarter: quarter }) => {
        const year2 = new Date(month).getFullYear()

        if (!isNaN(year2) && year2 === year && !quarters.includes(quarter)) {
          quarters.push(quarter)
        }
      })

      const sortedQuarters = quarters.sort((x, y) => parseInt(x) > parseInt(y))

      sortedQuarters.forEach(quarter => {
        const rows =
          data.filter(({ Month, Quarter }) => new Date(Month).getFullYear() === year &&
            Quarter === quarter)

        const sum = rows
          .reduce((totalCPMU, { CPMU }) => parseFloat(totalCPMU) + parseFloat(CPMU), 0)

        const cpmu = sum / rows.length

        visibleData.push({
          CPMU: !isNaN(cpmu) ? cpmu.toFixed(2) : 'No Value',
          Quarter: quarter,
          Year: year
        })
      })
    })

    return visibleData
  }
}

export default CPMU
