import React, { useState, useEffect } from "react";
import OpenAI from "openai";



function Chatbot(props) {
    const openai = new OpenAI();

    function startChat(promptMessage) {
        const thread = openai.beta.threads.create();
        const message = await openai.beta.threads.messages.create(
            thread.id,
            {
              role: "user",
              content: promptMessage
            }
          );
    }
   

   
    return (

    )
    }

export default Chatbot;