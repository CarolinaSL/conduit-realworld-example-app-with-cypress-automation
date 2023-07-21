const element = require('./elements').ELEMENTS;
const elementHeader = require('../superiorMenu/elements').ELEMENTS;

class login{

    validateLoginPage(){

        cy.url('/login').then(() => {
            cy.contains('Sign in');
        });
    }

    toLogout(){
        return cy.get(elementHeader.profileIcon).click().then(() => {
            cy.get(elementHeader.profileMenu)
                    .contains('Logout').click();             
    });  
    }

    loginWithValidCredentials(email, password){
        cy.get(element.emailInput)
            .should('have.attr','type', 'email')
            .and('have.attr','placeholder', 'Email')
            .type(email);

         cy.get(element.passwordInput)
            .should('have.attr','type', 'password')
            .and('have.attr','placeholder', 'Password')
            .type(password); 
        
        cy.intercept('POST', 'api/users/login').as('postLogin');
            
        cy.get(element.loginButton).contains('Login').click();

        cy.wait('@postLogin').its('response.statusCode').should('eq',200)
        
    }
    
    loginWithInvalidCredentials(username, password){
        cy.get(element.emailInput)
            .should('have.attr','type', 'email')
            .and('have.attr','placeholder', 'Email')
            .type(username);

         cy.get(element.passwordInput)
            .should('have.attr','type', 'password')
            .and('have.attr','placeholder', 'Password')
            .type(password); 

      
            
        return cy.get(element.loginButton).contains('Login').click();
        
    }

    acessarPaginaRegistro(){
        
        return cy.contains(element.registerLinkText).as('registerLink').click();
    }

    

};

export default new login();