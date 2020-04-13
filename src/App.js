/* eslint-disable */
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import ReactTable from 'react-table';
import moment from 'moment';
import { Pie, Bar } from 'react-chartjs-2';
import tuLogo from './TU-Signet.png';
import ReactJson from 'react-json-view';
import sin1008 from './sin1008_parsed.json'
import pin1008 from './pin1008_parsed.json'
import mdft_03 from './MDFT_03.ipm_parsed.json'
import mdft_04 from './MDFT_04.ipm_parsed.json'
import mdft_05 from './MDFT_05.ipm_parsed.json'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parsedContent: '',
      balanceZoom: false,
      balanceSort: false,
      balanceZoomIndex: 0,
      balanceZoomPageSize: 30,
      balanceZoomData: {},
      balanceZoomEnd: false,
      balanceZoomStart: true,
      balanceZoomMaxValue: 0
    };
  }

  toggleBalanceZoom() {
    this.setState({ balanceZoom: !this.state.balanceZoom }, () => {
      if (this.state.balanceZoom) {
        this.recalculateBalanceData(0, this.state.balanceZoomPageSize);
      } else {
        this.unZoomBalanceData();
      }
    });
    this.setState({
      balanceZoomIndex: 1,
      balanceZoomStart: true,
      balanceZoomEnd: false
    });
  }

  toggleBalanceSort() {
    this.setState({ balanceSort: !this.state.balanceSort }, () => {
      if (this.state.balanceSort) {
        this.setState({
          balanceZoomData: this.state.parsedContent.balanceDataSorted
        });
      } else {
        this.setState({
          balanceZoomData: this.state.parsedContent.balanceData
        });
      }
      this.setState({
        balanceZoom: false,
        balanceZoomIndex: 1,
        balanceZoomStart: true,
        balanceZoomEnd: false
      });
    });
  }

  unZoomBalanceData() {
    if (this.state.parsedContent.balanceData.labels) {
      this.recalculateBalanceData(
        0,
        this.state.parsedContent.balanceData.labels.length
      );
    }
  }

  nextPageBalance() {
    if (this.state.balanceZoomEnd) {
      window.alert('already on the last page');
      return;
    }
    let newZoomIndex = this.state.balanceZoomIndex + 1;
    let newRange = newZoomIndex * this.state.balanceZoomPageSize;
    let dataSize = this.state.parsedContent.balanceData.labels.length;
    let start = this.state.balanceZoomIndex * this.state.balanceZoomPageSize;
    let end;
    if (newRange > dataSize) {
      end = dataSize;
      this.setState({ balanceZoomEnd: true });
    } else {
      end = newRange;
      this.setState({ balanceZoomIndex: newZoomIndex });
    }
    this.setState({ balanceZoomStart: false });
    this.recalculateBalanceData(start, end);
  }

  previousPageBalance() {
    if (this.state.balanceZoomStart) {
      window.alert('already on the first page');
      return;
    }
    if (this.state.balanceZoomIndex === 1) {
      this.recalculateBalanceData(0, this.state.balanceZoomPageSize);
      this.setState({ balanceZoomStart: true });
      return;
    }
    let newZoomIndex = this.state.balanceZoomIndex - 1;
    let start = newZoomIndex * this.state.balanceZoomPageSize;
    let end = this.state.balanceZoomIndex * this.state.balanceZoomPageSize;
    this.recalculateBalanceData(start, end);
    this.setState({
      balanceZoomIndex: newZoomIndex,
      balanceZoomEnd: false
    });
  }

  recalculateBalanceData(start, end) {
    let newBalanceData = {
      labels: this.state.balanceSort
        ? this.state.parsedContent.balanceDataSorted.labels.slice(start, end)
        : this.state.parsedContent.balanceData.labels.slice(start, end),
      datasets: this.state.balanceSort
        ? this.state.parsedContent.balanceDataSorted.datasets.map(dataset => {
            return {
              label: dataset.label,
              fill: dataset.fill,
              backgroundColor: dataset.backgroundColor,
              borderColor: dataset.borderColor,
              pointHoverBackgroundColor: dataset.pointHoverBackgroundColor,
              data: dataset.data.slice(start, end)
            };
          })
        : this.state.parsedContent.balanceData.datasets.map(dataset => {
            return {
              label: dataset.label,
              fill: dataset.fill,
              backgroundColor: dataset.backgroundColor,
              borderColor: dataset.borderColor,
              pointHoverBackgroundColor: dataset.pointHoverBackgroundColor,
              data: dataset.data.slice(start, end)
            };
          })
    };
    this.setState({ balanceZoomData: newBalanceData });
  }

  render() {
    let content = this.state.parsedContent;
    return (
      <div>
        <img
          alt="TU Logo"
          src={tuLogo}
          style={{
            position: 'fixed',
            width: '50px',
            height: '50px',
            right: '3px',
            top: '3px'
          }}
        />
        <h2>View MPI Data, select file from list:</h2>
        <ul>
          <li><a href="#" onClick={() => this.openFile(sin1008)}>sin 1008</a></li>
          <li><a href="#" onClick={() => this.openFile(pin1008)}>pin 1008</a></li>
          <li><a href="#" onClick={() => this.openFile(mdft_03)}>MDFT 03</a></li>
          <li><a href="#" onClick={() => this.openFile(mdft_04)}>MDFT 04</a></li>
          <li><a href="#" onClick={() => this.openFile(mdft_05)}>MDFT 05</a></li>
        </ul>

        {content && (
          <div>
            <h3>Metadata</h3>
            <div>
              <strong>user:</strong> {content.metadata.username} <br />
              <strong>cmdline:</strong> {content.metadata.cmdline} <br />
              <strong>start:</strong>{' '}
              {moment
                .unix(content.metadata.start)
                .format('MMMM Do YYYY, h:mm:ss a')}{' '}
              <br />
              <strong>stop:</strong>{' '}
              {moment
                .unix(content.metadata.stop)
                .format('MMMM Do YYYY, h:mm:ss a')}{' '}
              <br />
              <strong>walltime:</strong> {content.metadata.walltime} seconds{' '}
              <br />
              <strong>mpi tasks:</strong>
              {' ' +
                content.metadata.ntasks +
                ' on ' +
                content.metadata.nhosts +
                ' hosts'}
              <br />
              <strong>%comm:</strong>
              {' ' +
                (
                  (content.mpiData.mpiAnalysis.totalTime /
                    content.metadata.totalWallTime) *
                  100
                ).toFixed(2)}
              {content.metadata.env && (
                <ReactJson
                  name="env"
                  src={content.metadata.env}
                  collapsed={true}
                />
              )}
            </div>
            <div className="pieCharts">
              <div className="floatLeft">
                <h3>Summarized MPI Time in %</h3>
                <div>
                  <Pie data={content.mpiPies.mpiPercent} />
                </div>
              </div>
              <div className="floatRight">
                <h3>MPI Time in % of total Wall Time</h3>
                <div>
                  <Pie data={content.mpiPies.mpiWall} />
                </div>
              </div>
            </div>

            {this.state.balanceZoomData && (
              <div>
                <h3>Communication balance by task</h3>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => this.toggleBalanceZoom()}
                >
                  Toggle Zoom
                </Button>{' '}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => this.toggleBalanceSort()}
                >
                  Toggle Sort
                </Button>
                {this.state.balanceZoom && (
                  <div>
                    <Button
                      variant="contained"
                      color="default"
                      onClick={() => this.previousPageBalance()}
                    >
                      Previous Page
                    </Button>{' '}
                    <Button
                      variant="contained"
                      color="default"
                      onClick={() => this.nextPageBalance()}
                    >
                      Next Page
                    </Button>
                  </div>
                )}
                <Bar
                  data={this.state.balanceZoomData}
                  options={{
                    scales: {
                      xAxes: [
                        {
                          stacked: true
                        }
                      ],
                      yAxes: [
                        {
                          stacked: true,
                          ticks: {
                            suggestedMax: this.state.balanceZoomMaxValue
                          }
                        }
                      ]
                    }
                  }}
                />
              </div>
            )}

            {content.mpiData &&
              Array.isArray(content.mpiData.mpiCalls) &&
              content.mpiData.mpiCalls !== 0 && (
                <div className="tableInfo">
                  <ReactTable
                    data={content.mpiData.mpiCalls}
                    columns={[
                      {
                        Header: 'All MPI Calls',
                        columns: [
                          {
                            Header: 'Call',
                            accessor: 'call'
                          },
                          {
                            Header: 'Buffer Size',
                            accessor: 'bytes'
                          },
                          {
                            Header: '# Calls',
                            accessor: 'count'
                          },
                          {
                            Header: 'Total Time',
                            accessor: 'ttot'
                          },
                          {
                            Header: 'Min Time',
                            accessor: 'tmin'
                          },
                          {
                            Header: 'Max Time',
                            accessor: 'tmax'
                          },
                          {
                            Header: '%MPI',
                            accessor: d =>
                              (d.ttot / content.mpiData.mpiAnalysis.totalTime) *
                              100,
                            id: 'percentMpi'
                          },
                          {
                            Header: '%Wall',
                            accessor: d =>
                              (d.ttot / content.metadata.totalWallTime) * 100,
                            id: 'percentWall'
                          }
                        ]
                      }
                    ]}
                    pageSizeOptions={[2, 5, 10, 20, 25, 50, 100]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                  />
                </div>
              )}

            {Array.isArray(content.hpmData) &&
              content.hpmData.length !== 0 && (
                <div className="tableInfo">
                  <ReactTable
                    data={content.hpmData}
                    columns={[
                      {
                        Header: 'HPM Counter Statistics',
                        columns: [
                          {
                            Header: 'Event',
                            accessor: 'name'
                          },
                          {
                            Header: 'Total Count',
                            accessor: 'counter'
                          },
                          {
                            Header: 'Avg',
                            accessor: d => (d.counter / d.ncalls).toFixed(2),
                            id: 'avg'
                          },
                          {
                            Header: 'Min',
                            accessor: 'min'
                          },
                          {
                            Header: 'Max',
                            accessor: 'max'
                          }
                        ]
                      }
                    ]}
                    pageSizeOptions={[2, 5, 10, 20, 25, 50, 100]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                  />
                </div>
              )}

            {Array.isArray(content.hosts) &&
              content.hosts.length !== 0 && (
                <div className="tableInfo">
                  <ReactTable
                    data={content.hosts}
                    columns={[
                      {
                        Header: 'All Hosts',
                        columns: [
                          {
                            Header: 'Name',
                            accessor: 'name'
                          },
                          {
                            Header: 'Mach Name',
                            accessor: 'mach_name'
                          },
                          {
                            Header: 'Mach Info',
                            accessor: 'mach_info'
                          },
                          {
                            Header: 'Tasks',
                            id: 'tasks',
                            accessor: d => d.tasks.join(', ')
                          }
                        ]
                      }
                    ]}
                    pageSizeOptions={[2, 5, 10, 20, 25, 50, 100]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                  />
                </div>
              )}
          </div>
        )}
      </div>
    );
  }

  openFile(file) {
    this.setState({parsedContent: file}, () => {
      // calculate max value for graph scaling
      if (this.state.parsedContent.balanceData.datasets.length) {
        let maxValues = [];
        this.state.parsedContent.balanceData.datasets[0].data.forEach(
          (data, index) => {
            let tempMaxValue = data;
            this.state.parsedContent.balanceData.datasets.forEach(
              (dataset, yindex) => {
                if (yindex === 0) return;
                tempMaxValue += dataset.data[index];
              }
            );
            maxValues.push(tempMaxValue);
          }
        );
        console.log(Math.max(...maxValues));
        this.setState({ balanceZoomMaxValue: Math.max(...maxValues) });
      }
      this.unZoomBalanceData();
    });
  }
}
