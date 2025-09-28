okay so the way that the jwt tokens are sent is , you create a signin route , you create a signin controller, in this signin controller you generate a token based on the user's information and with the help of jwt secret , and this token is sent to the server whenever the user sends the request to the backend, with the help of this token , the backend authenticates the user.

here in this case we don't have a signin route so there is no separate token being generated so the token has to be shared between the two backends , ofcourse we can use the same jwtSecret to authenticate verify the user token, 

but it still seems a little off here , how do you share the token here with the ...

okay this is actually really simple when the user signs-in the server sends the token to the frontend , which is sent to the backend everytime the user sends a request to the backend, so if two backends have the same frontend they both can access the token sent from the frontend thus they can authorize the user to access their resources , 

26th of september , 2025
1. we need to create a paymentSchema and a database as well 