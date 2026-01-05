/*
Inorder to know whether the serve is running and able to respond to requests,
we fetch a message from the server and display it in the "server-msg" div.
By adding below lined to the main index.html file:
    <!-- Server Message -->
    <div id="server-msg"></div>
    <script src="./server/server-msg.js"></script>
*/

fetch("/api/message")
    .then(r => r.json())
    .then(data => { document.getElementById("server-msg").textContent = data.message; })
    .catch(err => console.error("API error", err));