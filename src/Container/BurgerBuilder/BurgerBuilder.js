import React, {Component} from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../Components/Burger/Burger';
import BuildControls from '../../Components/Burger/BuildControls/BuildControls';
import Modal from '../../Components/UI/Modal/Modal'
import OrderSummary from '../../Components/Burger/OrderSummary/OrderSummary';

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
        ingredients: {
            salad:0,
            bacon:0,
            cheese:0,
            meat:0 
        },
        totalPrice: 50,
        purchasable: false,
        purchasing: false
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
        alert('Do you want to continue?')
    }
    render(){
        const disabledInfo ={
            ...this.state.ingredients
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
            
        }
        //(salad:true  ,  meat:false, ......etc)
        return (
            <Aux>
                <Modal show = {this.state.purchasing} modalClosed = {this.purchaseCancelHandler}>
                    <OrderSummary ingredients ={ this.state.ingredients}
                                  price = {this.state.totalPrice}
                                  puchaseCancelled = {this.purchaseCancelHandler}
                                  purchaseContinued = {this.purchaseContinueHandler} />
                </Modal>
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
    }
}


export default BurgerBuilder;
