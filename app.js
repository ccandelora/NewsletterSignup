const express = require('express');
const bodyParser = require('body-parser');
const mailchimp = require('@mailchimp/mailchimp_marketing');

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/signup.html');
    }
);

app.post('/', function(req, res) {
    const mailChimpApi = 'b30e2df986533ccd844963221499e111-us12';
    const mailChimpServerKey = 'us12';
    const listId = '2b54d657d0';
    const url = `https://${mailChimpServerKey}.api.mailchimp.com/3.0/lists/${listId}`;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    
    const addData = {
        members: [
            {
                email_address: email,
                status: 'subscribed',

                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }    
        ]
    };
 
    mailchimp.setConfig({
        apiKey: mailChimpApi,
        server: mailChimpServerKey,
        });
        
    const run = async () => {
        const response = await mailchimp.lists.batchListMembers(listId, {
            members: addData.members,
        });
        console.log(response.error_count);
        if (response.error_count === 0) {
            res.sendFile(__dirname + '/success.html');
        } else{
            res.sendFile(__dirname + '/failure.html');
        }
    };
        
    run();   
});

app.post('/failure', function(req, res) {
    res.redirect('/');
    }
);

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`);
    }
);
