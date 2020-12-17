import React, { Component } from 'react';
import axios from "axios";
import { withRouter } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Image,
  ListGroup
} from "react-bootstrap";
import { ScaleLoader } from 'react-spinners';
import { FaWindowClose } from "react-icons/fa";
import { Chart } from "react-google-charts";

class detailPokemon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prmoverlay:false,
            pokemonDetail:'',
            imageDetail:'',
            pokemonStats:''
        };
    }
    componentDidMount = () =>  {
        this.setState({
            ...this.state,
            prmoverlay:true,
        });
        axios
        .get(`${this.props.location.state.data.url}`)
        .then( async result => {
            let image = result.data.sprites
            let stats = await this.prosesPokemonStats(result.data.stats)
            this.setState({
            ...this.state,
            pokemonDetail: result.data,
            imageDetail: image.other.dream_world,
            pokemonStats:stats,
            prmoverlay:false,
            });
        })
        .catch(error => {
            console.log(error);
        });
    }
    prosesPokemonStats = async (data) =>  {
        let newStatsData = []
        newStatsData.push(["statsName","statsValue"])
        for (let i=0;i<data.length;i++) {
            newStatsData.push([data[i].stat.name,data[i].base_stat])
        }
        return newStatsData
    }
    backToMain = () =>{
        this.props.history.push({pathname: "/"})
    }
    render() {
        console.log(this.state.pokemonStats);
        return (
            <div>
                <div style={{visibility:this.state.prmoverlay===true?"visible":"hidden"}}>
                    <div className="overlayMask">
                        <ScaleLoader
                        height={90}
                        width={20}
                        radius={10}
                        margin={10}
                        color={'#ffffff'}
                        loading={this.state.prmoverlay === true?true:false}
                        />
                        <span style={{color:"#ffffff"}}>Waiting for data . . . </span>
                    </div>
                </div>
                <Container>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header as="h5">
                                    <Row>
                                        <Col xs md lg="10">
                                            {this.state.pokemonDetail.name}
                                        </Col>
                                        <Col xs md lg="2" className="alCenterjustend">
                                            <div>
                                                <button className="myBtn" onClick={()=> this.backToMain()}><FaWindowClose/></button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col>
                                            <Card>
                                                <Card.Body className="centerAll">
                                                    <Image width="500px" src={`${this.state.imageDetail.front_default}`} rounded />
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <ListGroup>
                                                <ListGroup.Item><h5>{`BASE EXPERIENCE : ${this.state.pokemonDetail.base_experience}`}</h5></ListGroup.Item>
                                                <ListGroup.Item><h5>{`HEIGHT : ${this.state.pokemonDetail.height}`}</h5></ListGroup.Item>
                                                <ListGroup.Item><h5>{`WEIGHT : ${this.state.pokemonDetail.weight}`}</h5></ListGroup.Item>
                                            </ListGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Card>
                                                <Card.Body className="centerAll">
                                                    <Chart
                                                        width={'100%'}
                                                        height={'300px'}
                                                        chartType="Bar"
                                                        loader={<div>Loading Chart</div>}
                                                        data={this.state.pokemonStats}
                                                        options={{
                                                            // Material design options
                                                            chart: {
                                                            title: `${this.state.pokemonDetail.name}`,
                                                            subtitle: 'Stats',
                                                            },
                                                        }}
                                                        // For tests
                                                        rootProps={{ 'data-testid': '2' }}
                                                    />
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default withRouter(detailPokemon);