import React, { Component } from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

class ProductUpdate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			categories: [],
			name: '',
			stok: '',
			berat_kemasan: '',
			harga_supplyer: '',
			expire: '',
			deskripsi: '',
			type: '',
			kategori_id: '',
			foto_1: null,
			foto_2: null,
			foto_3: null
		}
	}

	componentDidMount() {
		axios.get(`http://apiklikfood.herokuapp.com/kategori`)
		  .then((response) => {
		  	this.setState({
		  		categories: response.data.data
		  	})
		  }).catch((error) => {
		  	toast.error("Something Went Wrong :(");
		  })

		  axios.defaults.headers = {  
			'Authorization': sessionStorage.api_token 
			}

		 axios.get(`http://apiklikfood.herokuapp.com/produksupplyer/show/`+this.props.match.params.id)
		  .then((response) => {
		  	this.setState({
		  		name: response.data.data.name,
		  		stok: response.data.data.stok,
		  		berat_kemasan: response.data.data.berat_kemasan,
		  		harga_supplyer: response.data.data.harga_supplyer,
		  		expire: response.data.data.expire,
		  		deskripsi: response.data.data.deskripsi,
		  		type: response.data.data.type,
		  		kategori_id: response.data.data.kategori_id,
		  		foto_1: response.data.data.foto_1,
		  		foto_2: response.data.data.foto_2,
		  		foto_3: response.data.data.foto_3
		  	})
		  }).catch((error) => {
		  	toast.error("Something Went Wrong :(");
		  })
	}

	handleChange = (event) => {
		this.setState({ 
			[event.target.name]: event.target.value
		})
	}

	handleChangeFoto1 = (e) => {
		this.setState({foto_1:e.target.files[0]})
	}

	handleChangeFoto2 = (e) => {
		this.setState({foto_2:e.target.files[0]})
	}

	handleChangeFoto3 = (e) => {
		this.setState({foto_3:e.target.files[0]})
	}

	handleSubmit = (event) => {
		event.preventDefault();
		const bodyFormData = new FormData();
		
		bodyFormData.set('name', this.state.name);
		bodyFormData.set('stok', this.state.stok);
		bodyFormData.set('berat_kemasan', this.state.berat_kemasan);
		bodyFormData.set('harga_supplyer', this.state.harga_supplyer);
		bodyFormData.set('expire', this.state.expire);
		bodyFormData.set('deskripsi', this.state.deskripsi);
		bodyFormData.set('type', this.state.type);
		bodyFormData.set('kategori_id', this.state.kategori_id);
		bodyFormData.append('foto_1', this.state.foto_1);
		bodyFormData.append('foto_2', this.state.foto_2);
		bodyFormData.append('foto_3', this.state.foto_3);

		axios.defaults.headers = {  
			'Content-Type': 'multipart/form-data',  
			'Authorization': sessionStorage.api_token 
		}
		console.log(bodyFormData);
		axios.post(`http://apiklikfood.herokuapp.com/produksupplyer/update/`+this.props.match.params.id, bodyFormData)
	      .then(response => {
	      	console.log(response)
	      	toast.success("Produk Berhasil diUbah!");
	      	setTimeout(() => {
	      		// window.location.href='/admin/products';
	      	}, 3000)
	      }).catch(err => {
	      	toast.error("Something Went Wrong :( ");
	      });
	}

	render() {
		return (
			<div>
				<ToastContainer />
				<div classname="row clearfix">
				    <div classname="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				        <div classname="card">
				            <div classname="header">
				              <h2>
				                Detail Produk
				              </h2>
				            </div>
				            <div classname="body">
				        		<Form onSubmit={this.handleSubmit} >
				        		  <Form.Group as={Row} controlId="formHorizontalName">
				        		    <Form.Label column sm={2}>
				        		      Nama Barang
				        		    </Form.Label>
				        		    <Col sm={10}>
				        		      <Form.Control type="text" placeholder="Name" name="name" value={this.state.name} onChange={this.handleChange} />
				        		    </Col>
				        		  </Form.Group>
				        		  <Form.Group as={Row} controlId="formHorizontalName">
				        		    <Form.Label column sm={2}>
				        		      Stok
				        		    </Form.Label>
				        		    <Col sm={10}>
				        		      <Form.Control type="number" placeholder="Stok" name="stok" value={this.state.stok} onChange={this.handleChange} />
				        		    </Col>
				        		  </Form.Group>
				        		  <Form.Group as={Row} controlId="formHorizontalName">
				        		    <Form.Label column sm={2}>
				        		      Berat Kemasan
				        		    </Form.Label>
				        		    <Col sm={10}>
				        		      <Form.Control type="number" placeholder="Berat Kemasan" name="berat_kemasan" value={this.state.berat_kemasan} onChange={this.handleChange} />
				        		    </Col>
				        		  </Form.Group>
				        		  <Form.Group as={Row} controlId="formHorizontalName">
				        		    <Form.Label column sm={2}>
				        		      Harga Supplyer
				        		    </Form.Label>
				        		    <Col sm={10}>
				        		      <Form.Control type="number" placeholder="Harga Supplyer" name="harga_supplyer" value={this.state.harga_supplyer} onChange={this.handleChange} />
				        		    </Col>
				        		  </Form.Group>
				        		  <Form.Group as={Row} controlId="formHorizontalName">
				        		    <Form.Label column sm={2}>
				        		      Tanggal Kadaluarsa
				        		    </Form.Label>
				        		    <Col sm={10}>
				        		      <Form.Control type="date" placeholder="Kadaluarsa" name="expire" value={this.state.expire} onChange={this.handleChange} />
				        		    </Col>
				        		  </Form.Group>

				        		  <Form.Group as={Row} controlId="formHorizontalName">
				        		    <Form.Label column sm={2}>
				        		      Deskripsi
				        		    </Form.Label>
				        		    <Col sm={10}>
				        		      <Form.Control type="text" placeholder="Deskripsi" name="deskripsi" value={this.state.deskripsi} onChange={this.handleChange} />
				        		    </Col>
				        		  </Form.Group>

				        		  <Form.Group as={Row} controlId="formHorizontalName">
				        		    <Form.Label column sm={2}>
				        		      Upload Gambar
				        		    </Form.Label>
				        		    <Col sm={3}>
				        		    { (this.state.foto_1) ? 
				        		    	<img src={ "http://bajax.0hi.me/produk/" + this.props.match.params.id + "/" + this.state.foto_1 } height="150px" />
				        		    	: null
				        		    }
				        		      <Form.Control type="file" name="foto_1" onChange={this.handleChangeFoto1} />
				        		    </Col>
				        		    <Col sm={3}>
				        		    { (this.state.foto_2) ? 
				        		    	<img src={ "http://bajax.0hi.me/produk/" + this.props.match.params.id + "/" + this.state.foto_2 } height="150px" />
				        		    	: null
				        		    }
				        		      <Form.Control type="file" name="foto_2" onChange={this.handleChangeFoto2} />
				        		    </Col>
				        		    <Col sm={3}>
				        		    { (this.state.foto_3) ? 
				        		    	<img src={ "http://bajax.0hi.me/produk/" + this.props.match.params.id + "/" + this.state.foto_3 } height="150px" />
				        		    	: null
				        		    }
				        		      <Form.Control type="file" name="foto_3" onChange={this.handleChangeFoto3} />
				        		    </Col>
				        		  </Form.Group>

				        		  <Form.Group as={Row} controlId="formHorizontalName">
				        		    <Form.Label column sm={2}>
				        		      Kategori
				        		    </Form.Label>
				        		    { this.state.categories.map((category,i) =>
				        		    <Col sm={2}>
				        		    <label>{ category.kategori.name }</label>
				        		    	{ category.subkategori.map((subkategori,i) =>
			        		            <Form.Check
			        		              type="radio"
			        		              label={subkategori.name}
			        		              name="kategori_id"
			        		              id="formHorizontalRadios1"
			        		              value={subkategori.kategori_id}
			        		              onClick={this.handleChange}
			        		            />
			        		            )}
			        		        </Col>
			        		        )}
				        		  </Form.Group>

				        		  <Form.Group as={Row}>
				        		    <Col sm={{ span: 10, offset: 2 }}>
				        		      <Button type="submit">Update</Button>
				        		    </Col>
				        		  </Form.Group>
				        		</Form>;
				            </div>
				        </div>
				    </div>
				</div>
			</div>
		);
	}
}
export default ProductUpdate;