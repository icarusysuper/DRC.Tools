import React from 'react'
import { connect } from 'dva'
import styles from './index.css'
import { Upload, Button, Icon, Row, Col } from 'antd'
import * as services from '../services'

class IndexPage extends React.Component {
  state = {
    guid: null,
    used: false,
    path: null
  }

  async componentDidMount() {
    const { guid } = await services.getGuid()
    console.log('guid: ', guid)
    this.setState({ guid })
  }

  onChange = ({file, fileList, event}) => {
    this.setState({ used: true })

    if (file.percent === 100 && file.response && file.response.success) {
      const { path } = file.response
      this.setState({ path })
    }
  }

  render() {
    const { guid, used, path } = this.state
    const disabled = used || !guid
    return (
      <div className={styles.container}>
        <Row>
          <Col span="12">
            <Upload
              action="/api/upload"
              accept="application/zip"
              // directory
              name="drcfile"
              data={{ guid }}
              disabled={disabled}
              onChange={this.onChange}
            >
              <Button>
                <Icon type="upload" /> Upload
              </Button>
            </Upload>
          </Col>
          <Col span="12">
          < Button type="primary">生成</Button>
          </Col>
        </Row>
        <Row>
          { path ? <a target="_blank" href={path}>点击查看结果或者右键另存为</a> : null }
        </Row>
      </div>
    )
  }
}

IndexPage.propTypes = {
}

export default connect()(IndexPage)
