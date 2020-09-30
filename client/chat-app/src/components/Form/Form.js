import React from 'react';
import axios  from 'axios';
export default class Form extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            first_name:"",
            last_name:"",
            phone1:"",
            phone2:"",
            phone3:"",
            country:"",
            state:"",
            zipcode:"",
            email:"",
            address_line1:"",
            address_line2:"",
            basic_qualification_0:"",
            basic_qualification_1:"",
            comments:"",
            list:[],
            deleteStatus:true,
            delId:"",
            mdl:"",
            editForm:false,
            new_qualification_fields:[],
            view:{}
        }
    }
    componentDidMount = async () => {
        await this.getList();
    }
    getList = async () => {
        try{
            let result  =  await axios.get("http://localhost:3001/optisol/list");
            if(result.status == 200) {
                console.log("result",result.data.responseContents);
                this.setState({list:result.data.responseContents});
            }
        } catch(ex){
            console.log("ex",ex);   
        }
    }
    editItem = _id => {
       const { list } =  this.state;
       this.setState({editForm:true});
       const result  =  ( list || [] ).find((item)=>{
            return item._id == _id
       });
       if(result){
            let editQualification = result.qualification.length > 2 ? result.qualification.length - 2 : 0;
            let new_qualification_fields = [];
            if(editQualification){
                for(let i = 0 ;i < editQualification;i++){
                    new_qualification_fields = [...new_qualification_fields,'input-'+i]
                }
            }

            result.qualification.forEach((item,index)=>{
                var val = `basic_qualification_${index}`;
                this.setState({
                    [val]: item[val]
                })
            });
            this.setState({
                first_name:result.first_name,
                last_name:result.last_name,
                email:result.email,
                phone1:result.phone_number.toString().slice(0,3),
                phone2:result.phone_number.toString().slice(3,6),
                phone3:result.phone_number.toString().slice(6,10),
                address_line1:result.address[0].address_line1,
                address_line2:result.address[0].address_line2,
                city:result.address[0].city,
                country:result.address[0].country,
                state:result.address[0].state,
                zipcode:result.address[0].zipcode,
                new_qualification_fields: new_qualification_fields
            });
       }
    }
    viewItem = async _id => {
        try{
            let result =  await axios.get("http://localhost:3001/optisol/getById",{
                params: {_id}
            });
            if(result.status == 200){
                this.setState({view:result.data.responseContents});
            } else {
                this.setState({view:{}});
            }
        } catch(ex){
            console.log("ex",ex);
        } 
    }

    submitForm = async() => {
        try{
            const {
                first_name,last_name,phone1,phone2,phone3,country,
                state,zipcode,email,address_line1,address_line2,basic_qualification_0,
                basic_qualification_1,comments,editForm,new_qualification_fields
            } =  this.state;
            
            let qualification_details = [];
            //BIDING DYNAMIC STATE VALUE
            new_qualification_fields.forEach((item,index)=>{
                let val = index+2;
                qualification_details = [...qualification_details,{
                    ['basic_qualification_'+val]:this.state[item]  
                }]; 
            });
            qualification_details = [
                ...qualification_details,
                {basic_qualification_0},
                {basic_qualification_1}
            ];
            // PREPARING REQ BODY 
            let postData = {
                first_name,
                last_name,
                phone_number: phone1+phone2+phone3,
                email,
                address:{ address_line1,address_line2,country,state,zipcode},
                comments,
                qualification:qualification_details
            }
            let result ="";
            if(editForm){
                result = await axios.put("http://localhost:3001/optisol/update",postData);
            } else {
                 result = await axios.post("http://localhost:3001/optisol/create",postData);
            }
            
            if(result.status == 200){
                this.setState(
                    {   
                        first_name:"",last_name:"",phone1:"",phone2:"",
                        phone3:"",country:"",state:"",zipcode:"",email:"",
                        address_line1:"",address_line2:"",basic_qualification_0:"",
                        basic_qualification_1:"",comments:"" ,new_qualification_fields:[]
                    }
                )
            }
            await this.getList();
        } catch(ex) {
            console.log("ex",ex);
        }
    }
    deleteItem = async () => {
        const {delId:_id} = this.state;
        try{
            let result =  await axios.delete("http://localhost:3001/optisol/delete",{
                params: {_id}
            });
            if(result.status == 200){
                this.setState({delId:""});
            }
            await this.getList();
            this.buttonElement.click();
        } catch(ex){
            console.log("ex",ex);
        }
    }
    // ADDING DYNAMIC INPUT ELEMENT 
    createElement = () => {
        let  { new_qualification_fields } = this.state;
        let newInput = `input-${this.state.new_qualification_fields.length+2}`;
        new_qualification_fields = [...new_qualification_fields,newInput];
        this.setState({new_qualification_fields});
    }
    // REMOVING DYNAMIC INPUT ELEMENT 
    removeElement = (input) => {
        var {new_qualification_fields} = this.state;
		if(new_qualification_fields.length > 0)
		{	
			var i = new_qualification_fields.indexOf(input);
			if(i !== -1) {
				new_qualification_fields.splice(i, 1);
			}
			this.setState({new_qualification_fields});
			this.setState({[input]:''});
			this.setState({new_qualification_fields});
		}
    }
    render(){ 
        const  { list  ,view, new_qualification_fields} =  this.state;
        console.log("view",view);
        const list_result =  (list || []).map((item,index) => {
            let v = index+1;
            return (
                <tr key={index}>
                    <td>{item.first_name}</td>
                    <td>{item.email}</td>
                    <td>{item.phone_number}</td>
                    <td><button className="ed" onClick={()=>this.editItem(item._id)}>Edit</button></td>
                    <td><button className="ed" style={{"background":"#f00"}} data-toggle="modal" data-target="#expandmodal" onClick={()=>this.setState({deleteStatus:true,delId:item._id,mdl:v})}>Delete</button></td>
                    <td><button className="ed" style={{"background":"#000"}} data-toggle="modal" data-target="#viewmodal" onClick={()=>this.viewItem(item._id)} >View</button></td>
                </tr>
            )
        });
        let dynamicInputs = (new_qualification_fields || []).map((input,i)=>{
            return <div>
                     <input className='form-register text' key={input} type="text" placeholder="add " name={input} ref={input} value={this.state[input]} onChange={(e) => {this.setState({ [input]: e.target.value})}}/>
                     <img alt="" src= {require("../../assets/images/cross.png")} className="add" onClick={()=>{this.removeElement(input)}}/>
                   </div>
        })
        
        return(
            <div className="container">
                <div className="register col-md-5 col-sm-6">
                <h1 className="title"><strong>Bio Data</strong></h1>
                <form role="form">
                    <div className="form-group">
                        <label className="reg_txt">Name <span>*</span></label>
                        <div className="controls form-inline">       
                            <input type="text" className="input-name" placeholder="First" value={this.state.first_name} onChange={(e)=>{this.setState({first_name:e.target.value})}} />
                            <input type="text" className="input-name" placeholder="Last" value={this.state.last_name} onChange={(e)=>{this.setState({last_name:e.target.value})}}/>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="form-group">
                        <label className="reg_txt">Email  <span>*</span></label>
                        <input type="text" className="form-register text" id="" placeholder="E-mail" value={this.state.email} onChange={(e)=>{this.setState({email:e.target.value})}} />
                    </div>
                    <div className="clearfix"></div>
                    <div className="form-group" style={{"height":"70px"}}>
                        <label className="reg_txt">Phone Number  <span>*</span></label>
                        <div className="clearfix"></div>
                        <div className="wsite-form">
                            <input type="text" className="text input-name1"  value={this.state.phone1} onChange={(e)=>{this.setState({phone1:e.target.value})}} />
                        </div>
                        <div className="line">-</div>
                        <div className="wsite-form">
                            <input type="text" className="text input-name1" value={this.state.phone2} onChange={(e)=>{this.setState({phone2:e.target.value})}} />
                        </div>
                        <div className="line">-</div>
                        <div className="wsite-form">
                            <input type="text" className="text input-name1" value={this.state.phone3} onChange={(e)=>{this.setState({phone3:e.target.value})}}/>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="form-group">
                        <label className="reg_txt">Address  <span>*</span></label>
                        <input type="text" className="form-register text" id="" placeholder="Line 1" style={{"marginBottom":"15px"}} value={this.state.address_line1} onChange={(e)=>{this.setState({address_line1:e.target.value})}}/>
                        <input type="text" className="form-register text" id="" placeholder="Line 2" value={this.state.address_line2} onChange={(e)=>{ console.log(e.target.value);this.setState({address_line2:e.target.value})}}/>
                    </div>
                    <div className="form-group">
                        <div className="controls form-inline">       
                            <input type="text" className="input-name" placeholder="City" value={this.state.city} onChange={(e)=>{this.setState({city:e.target.value})}}/>
                            <input type="text" className="input-name" placeholder="State" value={this.state.state} onChange={(e)=>{this.setState({state:e.target.value})}}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="controls form-inline">       
                            <input type="text" className="input-name" placeholder="Zip Code" value={this.state.zipcode} onChange={(e)=>{this.setState({zipcode:e.target.value})}}/>
                            <input type="text" className="input-name" placeholder="Country" value={this.state.country} onChange={(e)=>{this.setState({country:e.target.value})}}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="reg_txt">Write Your qualification <span>*</span></label>
                        <input type="text" className="form-register text" id="" placeholder="" style={{"marginBottom":"15px"}} value={this.state.basic_qualification_0} onChange={(e)=>{this.setState({basic_qualification_0:e.target.value})}}/>
                        <input type="text" className="form-register text" id="" placeholder="Add your qualification" value={this.state.basic_qualification_1} onChange={(e)=>{this.setState({basic_qualification_1:e.target.value})}}/> 
                        <span onClick={()=>{this.createElement()}}><img alt="" src= {require("../../assets/images/plus.png")} className="add"/></span>
                        {dynamicInputs}
                    <div className="clearfix"></div>
                    <div className="form-group">
                        <label className="reg_txt">Comment  <span>*</span></label>                        
                        <textarea className="form-register text" value={this.state.comments} onChange={(e)=>{this.setState({comments:e.target.value})}}></textarea>
                    </div>
                    <div className="form-group">
                        <button type="button" onClick={()=>this.submitForm()}  className="btn btn-default submit" style={{"width":"97%"}}>Submit</button>
                    </div>
                </div> 
                </form>            
                </div>
                <div className="col-md-6 tabt">
                        <table className="table">
                            <tbody>
                                <tr className="ztxt">
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                    <th>View</th>
                                </tr>
                                    {list_result}
                            </tbody>
                        </table>
                    </div>
                    <div class="modal fade" id="expandmodal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLongTitle">Delete Item</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                Are you sure, do you want to delete this Item ? 
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal" ref={button => this.buttonElement = button}>No</button>
                                <button type="button" class="btn btn-primary" onClick={()=>{this.deleteItem()}}>Yes</button>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal fade" id="viewmodal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLongTitle">View Item</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <p>
                                   <span>Name :</span>
                                   <span>{view.first_name}</span> 
                                </p>
                                <p>
                                   <span>Email :</span>
                                   <span>{view.email}</span> 
                                </p>
                                <p>
                                   <span>address line1 :</span>
                                   <span>{(view.address && view.address.length > 0 ) ? view.address[0].address_line1 : ""}</span> 
                                </p>
                                <p>
                                   <span>address line2 :</span>
                                   <span>{(view.address && view.address.length > 0) ? view.address[0].address_line2 : ""}</span> 
                                </p>
                                <p>
                                   <span>state :</span>
                                   <span>{(view.address && view.address.length > 0) ? view.address[0].state :""}</span> 
                                </p>
                                <p>
                                   <span>zipcode :</span>
                                   <span>{(view.address && view.address.length > 0) ? view.address[0].zipcode :""}</span> 
                                </p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal" ref={button => this.buttonElement = button}>Close</button>
                            </div>
                            </div>
                        </div>
                    </div>
            </div> 
        )
    }
}    
