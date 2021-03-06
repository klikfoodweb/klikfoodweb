import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import axios from 'axios';
import qs from 'qs';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let jumlahProdukNya = 0;

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0
})

class ShowTransaction extends Component {
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			transaksi: [],
			details: [],
			pembayaran: '',
			payment_type: '',
			bukti: null,
			submitting: false
		}
	}

	componentWillMount() {
		jumlahProdukNya = 0;
		axios.get(`https://api.klikfood.id/index.php/transaksi/show/`+this.props.match.params.id, { 'headers': { 'Authorization': sessionStorage.api_token } })
		  .then((response) => {
		  	console.log(response.data.data.transaksi);
		  	this.setState({
		  		products: response.data.data.produk,
		  		transaksi: response.data.data.transaksi,
		  		details: response.data.data.transaksi.detail,
		  		payment_type: response.data.data.transaksi.tipe_bayar
		  	})
		  }).catch((error) => {
		  	console.log(error);
		  	toast.error("Gagal Mendapatkan Informasi Produk :(");
		  });

		axios.get(`https://api.klikfood.id/config/pembayaran`)
		  .then((response) => {
		  	console.log(response);
		  	this.setState({
		  		pembayaran: response.data.data.value
		  	})
		  }).catch((error) => {
		  	toast.error("Gagal Mendapatkan Info pembayaran :(");
		  })
	}

	indexN(cell, row, enumObject, index) {
	    return (<div>{index+1}</div>) 
	}

	hargaJual = (cell, row) => {
		return <div>{formatter.format(row.harga_jual)}</div>
	}

	handleChangeBukti = (e) => {
		this.setState({bukti:e.target.files[0]})
	}

	handleSubmit = (event) => {
		event.preventDefault();
		this.setState({
			submitting: true
		})
		const bodyFormData = new FormData();
		
		bodyFormData.set('bukti', this.state.bukti);

		axios.defaults.headers = {  
			'Content-Type': 'multipart/form-data',  
			'Authorization': sessionStorage.api_token 
		}
		
		axios.post(`https://api.klikfood.id/transaksi/bayar/`+this.props.match.params.id, bodyFormData)
	      .then(response => {
	      	this.setState({
				submitting: true
			})
	      	toast.success("Sukses Upload Bukti !");
	      	setTimeout(() => {
	      		window.location.href='/admin/transactions/' +this.props.match.params.id;
	      	}, 3000)
	      }).catch(err => {
	      	this.setState({
				submitting: false
			})
	      	toast.error("Gagal Upload Bukti :( ");
	      });
	}

	render() {
		return (
			<div>
			<ToastContainer />
				<div className="row clearfix">
				  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				    <div className="card">
				      <div className="header">
				        <h2>
				          Detail Transaksi
				        </h2>
				      </div>
				      <div className="body">
				      { 
				      	(this.state.transaksi !== 0) ? 
				      	<React.Fragment>
				      	<label>ID Transaksi = </label>  { this.state.transaksi._id }
				        <br />
				        <label>Harga Keseluruhan = </label> { formatter.format(this.state.transaksi.jumlah_keseluruhan) }
				        <br />
				        <label>Nama Pemesan = </label> { this.state.transaksi.user_name }
				        <br />
				        <label>Kota Tujuan = </label> { this.state.transaksi.detail_address } { this.state.transaksi.address }
				        <br />
				        <label>Status =  </label>
				        {
				        	(this.state.payment_type === 'TF') ?
				        		<React.Fragment>
				        		{
				        			(typeof this.state.transaksi.bayar !== 'undefined') ?
						        		<React.Fragment>
						        		<b>Sudah Dibayar</b>
						        		<br/>
						        		<img src={"https://api.klikfood.id/uploads/buktitf/"+this.props.match.params.id+"/"+this.state.transaksi.bayar} style={{maxHeight: '150px'}} alt />
						        		</React.Fragment>
						        	:
						        		<b>Belum Dibayar</b>
				        		}
				        		</React.Fragment>
				        	: (this.state.payment_type === 'VA') ?
				        		<React.Fragment>
				        		{
				        			(typeof this.state.transaksi.bayar !== 'undefined') ?
						        		<React.Fragment>
						        			<b>Sudah Dibayar</b>
						        		</React.Fragment>
						        	:
						        		<b>Belum Dibayar</b>
				        		}
				        		</React.Fragment>
				        	: (this.state.payment_type === 'CC') ?
				        		<React.Fragment>
				        		{
				        			(typeof this.state.transaksi.bayar !== 'undefined') ?
						        		<React.Fragment>
						        			<b>Sudah Dibayar</b>
						        		</React.Fragment>
						        	:
						        		<b>Belum Dibayar</b>
				        		}
				        		</React.Fragment>
				        	: null
				        }
				        <br />
				        <label>Detail Produk Yang Dipesan</label>
				        {
				        	this.state.details.map((item,i) => {
				        		jumlahProdukNya = jumlahProdukNya + Number(item.jumlah);
				        		return <div key={i}>{ this.state.products[i].name } ={ item.jumlah }</div>
				        	})
				        }
				        <label>Jumlah Produk Dipesan</label> <span>{jumlahProdukNya}</span>
				        </React.Fragment>
				        : null
				      }
				        <div className="table-responsive">
				        	<BootstrapTable data={this.state.products} striped search pagination hover>
	                  		  <TableHeaderColumn dataField='id' isKey={ true } hidden>User ID</TableHeaderColumn>
				        	  <TableHeaderColumn dataField="any" dataFormat={this.indexN} width='80'>No</TableHeaderColumn>
				        	  <TableHeaderColumn dataField='name' dataSort={true}>Name</TableHeaderColumn>
				        	  <TableHeaderColumn dataField='berat_kemasan' dataSort={true}>Jumlah (Kg/Gram/Pack)</TableHeaderColumn>
				        	  <TableHeaderColumn dataField='expire' dataSort={true}>Kadaluarsa</TableHeaderColumn>
				        	  <TableHeaderColumn dataField='harga_jual' dataSort={true} dataFormat={this.hargaJual}>Harga Jual</TableHeaderColumn>
		                  	</BootstrapTable>  
				        </div>
				        {
				        	(this.state.payment_type === 'CC') ?
				        		<React.Fragment>
				        			{
	        				        	(typeof this.state.transaksi.bayar === 'undefined') ?
				        				<React.Fragment>		
						        			<h3> Silahkan Transfer Sejumlah 
						        				<br />
						        					<i style={{color: 'red'}}> 
					        				        	{ 
					        				        		(typeof this.state.transaksi.jumlah_keseluruhan !== 'undefined') ?
					        				        			formatter.format(this.state.transaksi.jumlah_keseluruhan) 
					        				        		: null
					        				        	} 
			        				        		</i>
			        				        </h3>
			        				        <a href={"/admin/transactions/"+this.props.match.params.id+"/payment-method-cc"} className="btn btn-success">Lihat Metode Pembayaran</a>
			        				    </React.Fragment>
	        				        	: null
	        				        }
				        		</React.Fragment>
				        	: (this.state.payment_type === 'VA') ?
				        		<React.Fragment>
				        		{
	        				        (typeof this.state.transaksi.bayar === 'undefined') ?
					        		<React.Fragment>			
					        			<h3> Silahkan Transfer Sejumlah <br /><i style={{color: 'red'}}> 
		        				        	{ 
		        				        		(typeof this.state.transaksi.jumlah_keseluruhan !== 'undefined') ?
		        				        			formatter.format(this.state.transaksi.jumlah_keseluruhan) 
		        				        		: null
		        				        	} 
		        				        </i> </h3>
					        			<a href={"/admin/transactions/"+this.props.match.params.id+"/payment-method"} className="btn btn-success">Lihat Metode Pembayaran</a>
					        		</React.Fragment>
					        			: null
					        	}
				        		</React.Fragment>
				        	: (this.state.payment_type === 'TF') ?
				        		<React.Fragment>
	        				        {
	        				        	(typeof this.state.transaksi.bayar === 'undefined') ?
				        					<React.Fragment>
			        				        <h3> Silahkan Transfer Sejumlah <br /><i style={{color: 'red'}}> 
			        				        	{ 
			        				        		(typeof this.state.transaksi.jumlah_keseluruhan !== 'undefined') ?
			        				        			formatter.format(this.state.transaksi.jumlah_keseluruhan) 
			        				        		: null
			        				        	} 
			        				        </i> </h3>
			        				        <pre>{this.state.pembayaran}</pre>
			        				        <label>Upload Bukti Pembayaran</label>
			        			        	<form onSubmit={this.handleSubmit}>
			        			        		<input type="file" name="bukti" onChange={this.handleChangeBukti} />
			        			        		<br />
			        			        		{this.state.submitting ?
			        							<div>
			        								<b><center>Sedang Upload...</center></b>
			        							</div>
			        							:
			        								<button type="submit" className="btn btn-success">Kirim</button>
			        							}
			        			        	</form>			
				        					</React.Fragment>
				        				: null
				        			}
				        		</React.Fragment>
				        	: null
				        }
			        
				      </div>
				    </div>
				  </div>
				</div>
			</div>
		);
	}
}
export default ShowTransaction;