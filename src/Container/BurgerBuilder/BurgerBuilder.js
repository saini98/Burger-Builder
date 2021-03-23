import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../Components/Burger/Burger';
import BuildControls from '../../Components/Burger/BuildControls/BuildControls';
import Modal from '../../Components/UI/Modal/Modal'
import OrderSummary from '../../Components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../Components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
// import BurgerIngredient from '../../Components/Burger/BurgerIngredients/BurgerIngredients';

const INGREDIENTS_PRICE = {
    salad: 5,
    cheese: 10,
    meat: 20,
    bacon: 15
}

class BurgerBuilder extends Component
{

    state = {
        ingredients: null,
        totalPrice: 50,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount()
    {
        axios.get('https://react-my-burger-ccb95-default-rtdb.firebaseio.com/ingredients.json')
        .then(response => 
            {
               this.setState({ingredients:response.data}) ;
            })
            .catch(error => {
                this.setState({error:true})
            })
    }

    updatePurchaseState(ingredients) {
       
        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey]
        })
        .reduce((sum , el) => {
            return sum +el;
        },0);
        this.setState({purchasable: sum>0});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount +1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENTS_PRICE[type];
        const oldPrice  = this.state.totalPrice;
        const newPrice = oldPrice +priceAddition;
        this.setState({totalPrice:newPrice,
        ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);


    }

    removeIngredientsHandler = (type) => {

        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0)
        {
            return;
        }
        const updatedCount = oldCount -1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENTS_PRICE[type];
        const oldPrice  = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice:newPrice,
                       ingredients: updatedIngredients}) ;
            this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing:true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing:false});
    }

    purchaseContinueHandler = () => {
        

        const queryParams = [];
        for(let i in this.state.ingredients)
        {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' +this.state.totalPrice);

        const queryString = queryParams.join(' &');

        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        })
        

    }
    render(){
        const disabledInfo ={
            ...this.state.ingredients
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
            
        }

        let orderSummary = null;
       
           

        //(salad:true  ,  meat:false, ......etc)


        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> :<Spinner />;
        if(this.state.ingredients)
        {
            burger  = (
                <Aux>
                        <Burger ingredients = {this.state.ingredients} />
                        <BuildControls 
                        ingredientAdded = {this.addIngredientHandler}
                        ingredientRemoved = {this.removeIngredientsHandler}
                        disabled = {disabledInfo}
                        price = {this.state.totalPrice}
                        purchasable = {this.state.purchasable}
                        ordered = {this.purchaseHandler}
                        />
                </Aux>
               );
               orderSummary = <OrderSummary ingredients ={ this.state.ingredients}
               price = {this.state.totalPrice}
               puchaseCancelled = {this.purchaseCancelHandler}
               purchaseContinued = {this.purchaseContinueHandler} />;

        }

        if(this.state.loading)
        {
            orderSummary  = <Spinner />
        }
       

        return (
            <Aux>
                <Modal show = {this.state.purchasing} modalClosed = {this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}


export default withErrorHandler( BurgerBuilder,axios);
