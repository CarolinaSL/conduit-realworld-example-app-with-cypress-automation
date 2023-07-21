const element = require('./elements').ELEMENTS;
const elementHeader = require('../superiorMenu/elements').ELEMENTS;

class home{

    accessLoginPage(){
        
        cy.contains(element.loginAccessLinkText)
            .should('have.attr','href','#/login')
            .click();
    }

    accessHomePage(url){
        cy.visit(url);
    }

    acessNewArticlePage(){
        cy.contains('New Article')
            .should('have.attr','href','#/editor')
            .click();
    }
}

export default new home();