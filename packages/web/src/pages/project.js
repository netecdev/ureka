import React from 'react'
import Link from 'gatsby-link'
import {Container, Header, List, Grid, Menu, Segment, Radio} from 'semantic-ui-react'

const SecondPage = () => (
  <div>
    <Header>Project name</Header>
    <Grid>
  <Grid.Column width={4}>
    <Menu fluid vertical >
    <Menu.Item >
      <Menu.Header>Screenshots</Menu.Header>
      <Menu.Menu>
      <Menu.Item>
        App
      </Menu.Item>
      <Menu.Item>
        Website
      </Menu.Item>
      </Menu.Menu>
    </Menu.Item>
    <Menu.Item >
      <Menu.Header>Reports</Menu.Header>
      <Menu.Menu>
      <Menu.Item>
        Report.pdf

      </Menu.Item>
      </Menu.Menu>
    </Menu.Item>
    <Menu.Item>
      Share
    </Menu.Item>
    <Menu.Item>
      Contact netec
    </Menu.Item>
    </Menu>
  </Grid.Column>

  <Grid.Column stretched width={12}>
    <Segment>
    <div>
    <div style={{float: 'left', height: 10, width: 10, backgroundColor: 'red'}}/>
    <Radio toggle label="Styling"/>
    </div>
    <div>
    <div style={{float: 'left', height: 10, width: 10, backgroundColor: 'orange'}}/>
    <Radio toggle label="Language"/>
    </div>
    <div>
    <div style={{float: 'left', height: 10, width: 10, backgroundColor: 'blue'}}/>
    <Radio toggle label="Some other category"/>
    </div>
    </Segment>
    <img src={require('../../images/annotated.png')} style={{width: '100%', maxWidth: '1000px'}}/>
  </Grid.Column>
</Grid>
  </div>
)

export default SecondPage
