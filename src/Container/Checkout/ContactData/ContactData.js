
import React, {Component} from 'react';
import Button from '../../../Components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../Components/UI/Spinner/Spinner'
class ContactData extends Component
{
    state = {
        name: '',
        email: '',
        address : {
            street: '',
            postalCode:''
        },
        loading:false
    }
    orderhandler = (event) => 
    {
        event.preventDefault();
        this.setState({loading:true})
        //alert('Do you want to continue?')
        const order = {
            ingredients:this.state.ingredients,
            price: this.props.price,
            customer: {
                name: 'Sahil Saini',
                address: {
                    street:'Street -7',
                    zipCode: '232312',
                    country: 'India'
                },
                email: 'Saini@saini.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json',order)
        .then(respnse => {
            this.setState({loading:false});
            this.props.history.push('/')
        })
        .catch(error => {
            this.setState({loading:false});
        });

    }

    render()
    {
        let form = ( <form>
            <input className= {classes.Input} type='text' name= "name" placeholder = "Name" />
            <input className= {classes.Input}  type='email' name= "email" placeholder = "Email" />
            <input className= {classes.Input}  type='text' name= "street" placeholder = "Street" />
            <input className= {classes.Input}  type='text' name= "postal" placeholder = "Postal Code" />
            <Button btnType = "Success" clicked = {this.orderhandler}>ORDER</Button>
        </form> );
        if(this.state.loading)
        {
            form = <Spinner />;
        }
        return(
            <div className = {classes.ContactData}>
                <h4>Enter your Conatact data</h4>
               {form}
            </div>
        )
    }

}

export default ContactData;