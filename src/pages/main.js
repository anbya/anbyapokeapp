import React, { Component } from 'react';
import axios from "axios";
import { withRouter } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  InputGroup,
  FormControl,
  Button,
  ListGroup,
  Image
} from "react-bootstrap";
import { ScaleLoader } from 'react-spinners';
import DataTable from 'react-data-table-component';
import { FaSearch } from "react-icons/fa";
import Select from 'react-select';
import { Chart } from "react-google-charts";

class main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prmoverlay:false,
            loading:false,
            searchKey:'',
            masterPokemonList:[],
            pokemonList:[],
            prmPokemon:[],
            prmPokemon1:"",
            prmPokemon2:"",
            prmPokemonValue1:"",
            prmPokemonValue2:"",
            pokemonComparation:[],
            pokemonStatsComparation:[]
        };
    }
    componentDidMount = () =>  {
        this.setState({
            ...this.state,
            loading:true,
        });
        axios
        .get(`https://pokeapi.co/api/v2/pokemon`)
        .then(async result => {
            let prmPokemon = await this.prmPokemonProses(result.data.results)
            this.setState({
            ...this.state,
            masterPokemonList: result.data.results,
            pokemonList: result.data.results,
            prmPokemon: prmPokemon,
            loading:false,
            });
        })
        .catch(error => {
            console.log(error);
        });
    }
    prmPokemonProses = async (data) =>  {
        let prmPokemon = []
        for (let i=0;i<data.length;i++) {
            let prmPokemonTEMP = {
                value:`${data[i].name}`,
                label:`${data[i].name}`,
                url:`${data[i].url}`
            }
            prmPokemon.push(prmPokemonTEMP)
        }
        return prmPokemon
    }
    seeDetail = (data) =>  {
        this.props.history.push({pathname: "/detailPokemon",state: { data: data }})
    }
    handleChange = event =>  {
        let dataToFilter = this.state.masterPokemonList
        let filteredData =  dataToFilter.filter(function(data) {
            return data.name === event.target.value;
        });
        event.target.value===""?
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value,
            pokemonList:this.state.masterPokemonList
        })
        :
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value,
            pokemonList:filteredData
        })
    }
    onSelectPokemon1 = async (value) => {
      await this.setState({
        ...this.state,
        prmPokemon1: value,
        prmPokemonValue1: value.name
      });
    }
    onSelectPokemon2 = async (value) => {
      await this.setState({
        ...this.state,
        prmPokemon2: value,
        prmPokemonValue2: value.name
      });
    }
    comparePokemon = () => {
        this.state.prmPokemon1 === "" || this.state.prmPokemon2 === "" ?
        alert("Anda harus memilih dua POKEMON")
        :
        this.prosesComparePokemon()
    }
    prosesComparePokemon = () => {
        this.setState({
            ...this.state,
            prmoverlay:true,
        });
        let pokemonComparation = []
        axios
        .get(`${this.state.prmPokemon1.url}`)
        .then( async result1 => {
            let imagePokemon1 = result1.data.sprites
            let statsPokemon1 = await this.prosesPokemonStats(result1.data.stats)
            pokemonComparation.push(
                {
                    detailPokemon:result1.data,
                    pokemonImage:imagePokemon1.other.dream_world
                }
            )
            axios
            .get(`${this.state.prmPokemon2.url}`)
            .then( async result2 => {
                let imagePokemon2 = result2.data.sprites
                let statsPokemon2 = await this.prosesPokemonStats(result2.data.stats)
                pokemonComparation.push(
                    {
                        detailPokemon:result2.data,
                        pokemonImage:imagePokemon2.other.dream_world
                    }
                )
                let pokemonStatsComparation = await this.prosesPokemonStatsComparation(statsPokemon1,statsPokemon2,result1.data.name,result2.data.name)
                this.setState({
                ...this.state,
                pokemonComparation: pokemonComparation,
                pokemonStatsComparation: pokemonStatsComparation,
                prmPokemon1:"",
                prmPokemon2:"",
                prmPokemonValue1:"",
                prmPokemonValue2:"",
                prmoverlay:false
                });
            })
            .catch(error => {
                console.log(error);
            });
        })
        .catch(error => {
            console.log(error);
        });
    }
    prosesPokemonStats = async (data) =>  {
        let newStatsData = []
        for (let i=0;i<data.length;i++) {
            newStatsData.push({nameStats:data[i].stat.name,statsValue:data[i].base_stat})
        }
        return newStatsData
    }
    prosesPokemonStatsComparation = async (data1,data2,name1,name2) =>  {
        let pokemonStatsComparation = []
        pokemonStatsComparation.push(["statsName",`${name1}`,`${name2}`])
        for (let i=0;i<data1.length;i++) {
            let filteredData =  data2.filter(function(data) {
                return data.nameStats === data1[i].nameStats;
            });
            pokemonStatsComparation.push([data1[i].nameStats,data1[i].statsValue,filteredData[0].statsValue])
        }
        return pokemonStatsComparation
    }
    hapusDataCompare = () => {
        this.setState({
            ...this.state,
            pokemonComparation:[],
            pokemonStatsComparation:[]
        });
    }
    render() {
        console.log(this.state.pokemonComparation);
        console.log(this.state.pokemonStatsComparation);
        const DataButton = (data) => (
            <div>
                <button className="myBtn" onClick={()=> this.seeDetail(data)}><FaSearch/></button>
            </div>
        );
        const columns = [
            {
                name: 'POKEMON NAME',
                selector: 'name',
                sortable: true,
            },
            {
                name: 'Tool',
                button: true,
                cell: row => DataButton(row),
            },
        ];
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
                <Container fluid={true} style={{paddingTop:"50px",paddingBottom:"50px"}}>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header as="h5">
                                    <Row>
                                        <Col xs md lg="8">
                                            POKEMON LIST
                                        </Col>
                                        <Col xs md lg="4">
                                            <div>
                                                <InputGroup>
                                                    <InputGroup.Prepend>
                                                    <InputGroup.Text id="search">Search By POKEMON Name</InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <FormControl
                                                        name="searchKey"
                                                        value={this.state.searchKey}
                                                        placeholder="Pokemon Name"
                                                        aria-label="Pokemon Name"
                                                        aria-describedby="search"
                                                        onChange={this.handleChange}
                                                    />
                                                </InputGroup>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Card.Body>
                                    <DataTable
                                        columns={columns}
                                        data={this.state.pokemonList}
                                        defaultSortField="title"
                                        pagination={true}
                                        highlightOnHover={true}
                                        striped={false}
                                        progressPending={this.state.loading}
                                        noHeader={true}
                                        fixedHeader={false}
                                        fixedHeaderScrollHeight="300px"
                                    />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    {this.state.pokemonComparation.length===0?
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header as="h5" className="centerAll">
                                    COMPARE A POKEMON
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col xs="12" md="5" lg="5">
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                isClearable={false}
                                                isSearchable={true}
                                                name="prmPokemonValue1"
                                                value={this.state.prmPokemonValue1}
                                                options={this.state.prmPokemon}
                                                onChange={this.onSelectPokemon1.bind(this)}
                                                placeholder="Pilih POKEMON Pertama"
                                            />
                                        </Col>
                                        <Col xs="12" md="2" lg="2" className="centerAll">
                                            <h5>VS</h5>
                                        </Col>
                                        <Col xs="12" md="5" lg="5">
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                isClearable={false}
                                                isSearchable={true}
                                                name="prmPokemonValue2"
                                                value={this.state.prmPokemonValue2}
                                                options={this.state.prmPokemon}
                                                onChange={this.onSelectPokemon2.bind(this)}
                                                placeholder="Pilih POKEMON Kedua"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div style={{paddingTop:"20px"}}>
                                                <Button variant="primary" onClick={()=> this.comparePokemon()} block>COMPARE</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    :
                    <Row>
                        <Col>
                            <Card>
                                <Card.Header as="h5" className="centerAll">
                                    {`${this.state.pokemonComparation[0].detailPokemon.name} VS ${this.state.pokemonComparation[1].detailPokemon.name}`}
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col xs="12" md="6" lg="6">
                                            <Card>
                                                <Card.Header className="centerAll">
                                                    <Image width="300px" height="300px" src={`${this.state.pokemonComparation[0].pokemonImage.front_default}`} rounded />
                                                </Card.Header>
                                                <Card.Body>
                                                    <ListGroup>
                                                        <ListGroup.Item><h5>{`BASE EXPERIENCE : ${this.state.pokemonComparation[0].detailPokemon.base_experience}`}</h5></ListGroup.Item>
                                                        <ListGroup.Item><h5>{`HEIGHT : ${this.state.pokemonComparation[0].detailPokemon.height}`}</h5></ListGroup.Item>
                                                        <ListGroup.Item><h5>{`WEIGHT : ${this.state.pokemonComparation[0].detailPokemon.weight}`}</h5></ListGroup.Item>
                                                    </ListGroup>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col xs="12" md="6" lg="6">
                                            <Card>
                                                <Card.Header className="centerAll">
                                                    <Image width="300px" height="300px" src={`${this.state.pokemonComparation[1].pokemonImage.front_default}`} rounded />
                                                </Card.Header>
                                                <Card.Body>
                                                    <ListGroup>
                                                        <ListGroup.Item><h5>{`BASE EXPERIENCE : ${this.state.pokemonComparation[1].detailPokemon.base_experience}`}</h5></ListGroup.Item>
                                                        <ListGroup.Item><h5>{`HEIGHT : ${this.state.pokemonComparation[1].detailPokemon.height}`}</h5></ListGroup.Item>
                                                        <ListGroup.Item><h5>{`WEIGHT : ${this.state.pokemonComparation[1].detailPokemon.weight}`}</h5></ListGroup.Item>
                                                    </ListGroup>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Card>
                                                <Card.Body className="centerAll">
                                                    <Chart
                                                        width={'100%'}
                                                        height={'500px'}
                                                        chartType="Bar"
                                                        loader={<div>Loading Chart</div>}
                                                        data={this.state.pokemonStatsComparation}
                                                        // options={{
                                                        //     // Material design options
                                                        //     chart: {
                                                        //     title: `${this.state.pokemonDetail.name}`,
                                                        //     subtitle: 'Stats',
                                                        //     },
                                                        // }}
                                                        // For tests
                                                        rootProps={{ 'data-testid': '2' }}
                                                    />
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div style={{paddingTop:"20px"}}>
                                                <Button variant="danger" onClick={()=> this.hapusDataCompare()} block>HAPUS DATA KOMPARASI</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    }
                </Container>
            </div>
        );
    }
}

export default withRouter(main);