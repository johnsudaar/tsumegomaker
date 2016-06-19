var player_color;
var b;                  //board object retrieved from the server
var legal_moves;        //legal moves array retrieved from the server
var end = false;        //true when the user wins or loses

//functions in this file :
//function clicked(obj);
//function send_move(i, j);
//function update_board();
//function create_html_board();
//function update_display_board();
//function create_gamestate(problem_id);
//function update_legal_moves();
//function update_hover_moves();

$(document).ready(function(){
    console.log("Started script.");

    var problem_id = parseInt($("#problem_id").text());
    if(problem_id == undefined || isNaN(problem_id)){
      console.log("Main function : could not parse problem_id : " + problem_id.toString());
    }

    create_gamestate(problem_id);
    update_player_color();
    update_board();
    create_html_board();
    update_display_board();
    update_legal_moves();
    update_hover_moves();
});

/**
* \brief function called when a user clicks a square on the board.
*        It is passed the object that was clicked.
*/
function clicked(obj){
    console.log("User clicked.");
    if(end == true){    //if this is the end of the game, do nothing
        return;
    }
    var row = parseInt(obj.id[0]);
    var column = parseInt(obj.id[2]);

    if(legal_moves[row][column]){
        //display player's move temporarily, before recieving server's response
        if(player_color == 1){
            $("#" + row + "-" + column + " div").attr('class', 'black_stone');
        }
        if(player_color == 2){
            $("#" + row + "-" + column + " div").attr('class', 'white_stone');
        }

        //send move to the server
        setTimeout(send_move, 100, row, column);
    }
    else{
        console.log("But the move is not legal.");
    }
}

/**
* \brief sends a move to the server and updates the board and its display afterwards,
*        updates legal moves as well.
*/
function send_move(i, j){
    var url = "/move?i=" + i.toString() + "&j=" + j.toString();
    var request = $.get(url, null, after_send);
    request.fail(function(jqXHR){
        console.log("Get request to send move failed.");
        display_rails_error(jqXHR)
    });

    //FUNCTION THAT IS CALLED AFTER THE MOVE IS SENT :
    function after_send(data){
        if(filter_error(data)) return;

        console.log("after_send() : successfully sent move (" + i.toString() + ", " + j.toString() + ")");
        filter_message(data);
        update_board();
        update_display_board();
        update_legal_moves();
        update_hover_moves();
    }
}

/**
* \brief Asks the server for the board, and updates the global variable "b".
*/
function update_board(){
    console.log("Updating board.");

    var req = $.get({url : "/get_board",
                     complete : after_get_board,
                     error : request_error,
                     async : false});

    function request_error(jqXHR){
        console.log("update_board() : Get request to get board failed.");
        display_rails_error(jqXHR);
    }

    function after_get_board(jqXHR){
        var data = jqXHR.responseText;
        console.log("Successfully recieved board data : " + data);

        if(filter_error(data)) return;

        //update global variable
        try{
            b = jqXHR.responseJSON;
        }
        catch(e){
            console.log("In after_get_board() : ");
            console.log(e.message);
        }

        console.log("Updated board into array. height : " + b.height.toString() + " width : " + b.width.toString());
    }
}

/**
* \brief Builds the HTML code needed to display the board given in the global variable
*/
function create_html_board(){
    console.log("Creating html tags.");

    //checking if b is defined
    if(b == undefined){
        console.log("create_html_board() : cannot build html because board was not initialized");
        return;
    }

    //checking whether the html of the board has already been created
    var board_tag = $("#board");
    if(board_tag.html() != undefined) {
        if (board_tag.html().search("<table>") >= 0) {
            console.log("create_html_board() : html for board has already been build. See #board : " + $("#board").html());
            return;
        }
    }

    //creating the html
    var i, j;
    board_tag.append("<table/>");
    for(i = 0; i<b.height; i++){
        //creating 'tr' tag inside 'table'
        var table_row = $("<tr>", {id: i});
        table_row.appendTo("table");

        for(j = 0; j<b.width; j++){
            //creating 'td' tag inside 'tr'
            //class 'board_square' is to indicate that this tag is a board square,
            //'middle' is to indicate that this square is in a middle square. Could be
            //'down_border' or 'left_border' or 'down_right_corner' ... etc
            var table_data = $("<td/>", {id: i + "-" + j, class: "board_square middle"});
            table_data.appendTo(table_row);
            //creating 'div' tag inside 'td', used for holding the class indicating
            //the color of the stone, can be 'empty', 'legal_move', 'white', 'black'
            var div = $("<div/>", {class: "empty"});
            div.appendTo(table_data);
        }
    }

    //adding events on every square
    for(i = 0; i<b.height; i++){
        for(j = 0; j<b.width; j++){
            select_square(i, j).on("click", function(){ clicked(this); });
        }
    }

    //drawing corner squares
    var up_left_square = select_square(0, 0);
    var up_right_square = select_square(0, b.width-1);
    var down_left_square = select_square(b.height-1, 0);
    var down_right_square = select_square(b.height-1, b.width-1);
    //up_left_square
    if(b.not_border[0]){
        if(b.not_border[1])
            up_left_square.attr("class", "board_square middle");
        else
            up_left_square.attr("class", "board_square left_border");
    }
    else{
        if(b.not_border[1])
            up_left_square.attr("class", "board_square up_border");
        else
            up_left_square.attr("class", "board_square up_left_corner");
    }
    //up_right_square
    if(b.not_border[0]){
        if(b.not_border[2])
            up_right_square.attr("class", "board_square middle");
        else
            up_right_square.attr("class", "board_square right_border");
    }
    else{
        if(b.not_border[2])
            up_right_square.attr("class", "board_square up_border");
        else
            up_right_square.attr("class", "board_square up_right_corner");
    }
    //down_left_square
    if(b.not_border[3]){
        if(b.not_border[1])
            down_left_square.attr("class", "board_square middle");
        else
            down_left_square.attr("class", "board_square left_border");
    }
    else{
        if(b.not_border[1])
            down_left_square.attr("class", "board_square down_border");
        else
            down_left_square.attr("class", "board_square down_left_corner");
    }
    //down_right_square
    if(b.not_border[3]){
        if(b.not_border[2])
            down_right_square.attr("class", "board_square middle");
        else
            down_right_square.attr("class", "board_square right_border");
    }
    else{
        if(b.not_border[2])
            down_right_square.attr("class", "board_square down_border");
        else
            down_right_square.attr("class", "board_square down_right_corner");
    }

    //drawing borders
    if(! b.not_border[0]){
        i = 0;
        for(j = 1; j<b.width-1; j++){
            select_square(i, j).attr('class', 'board_square up_border');
        }
    }
    if(! b.not_border[3]){
        i = b.height-1;
        for(j = 1; j<b.width-1; j++){
            select_square(i, j).attr('class', 'board_square down_border');
        }
    }
    if(! b.not_border[1]){
        j = 0
        for(i = 1; i<b.height-1; i++){
            select_square(i, j).attr('class', 'board_square left_border');
        }
    }
    if(! b.not_border[2]){
        j = b.width-1
        for(i = 1; i<b.height-1; i++){
            select_square(i, j).attr('class', 'board_square right_border');
        }
    }

    //drawing not borders
    //up
    if(b.not_border[0]){
        var my_tr = $("<tr>", {id: "up_not_border"});
        my_tr.prependTo("table");       //add a tr at the top
        for(var j = 0; j < b.width; j++){
            //for each square of the first row, copy its class and create a td
            //with the same class above it
            var cur_class = select_square(0, j).attr('class');
            $("<td>", {class: cur_class + " not_border fade_up"}).appendTo(my_tr);
        }
    }
    //down
    if(b.not_border[3]){
        var my_tr = $("<tr>", {id: "down_not_border"});
        my_tr.appendTo("table");
        for(var j = 0; j < b.width; j++){
            //for each square of the last row, copy its class and create a td
            //with the same class under it
            var cur_class = select_square(b.height-1, j).attr('class');
            $("<td>", {class: cur_class + " not_border fade_down"}).appendTo(my_tr);
        }
    }
    //left
    if(b.not_border[1]){
        for(var i = 0; i < b.height; i++){
            var cur_class = select_square(i, 0).attr('class');
            $("<td>", {class: cur_class + " not_border fade_left"}).prependTo("tr#" + i.toString());
        }
    }
    //right
    if(b.not_border[2]){
        for(var i = 0; i < b.height; i++){
            var cur_class = select_square(i, b.width-1).attr('class');
            $("<td>", {class: cur_class + " not_border fade_right"}).appendTo("tr#" + i.toString());
        }
    }

    //drawing corner of not_borders
    //upleft
    if(b.not_border[0]){
        if(b.not_border[1]){
            $("<td>", {class: "board_square middle not_border fade_up_left"}).prependTo("tr#up_not_border");
        }
        if(b.not_border[2]){
            $("<td>", {class: "board_square middle not_border fade_up_right"}).appendTo("tr#up_not_border");
        }
    }
    if(b.not_border[3]){
        if(b.not_border[1]){
            $("<td>", {class: "board_square middle not_border fade_down_left"}).prependTo("tr#down_not_border");
        }
        if(b.not_border[2]){
            $("<td>", {class: "board_square middle not_border fade_down_right"}).appendTo("tr#down_not_border");
        }
    }

    //checking if the function worked
    if(board_tag.html() == undefined){
        console.log("something went wrong creating html tags, because board_tag.html() is undefined");
    }
}

/**
* \brief updates the display of the board according to 'b'. The global variable 'b'
*        has to be set, and the html tags have to be there.
*/
function update_display_board(){
    console.log("Updating html according to the board global variable.");

    //cheking if 'b' is set
    if(b == undefined){
        console.log("update_display_board() : cannot build html because board was not initialized");
        return;
    }

    //checking if the board html is there
    var board_tag = $("#board");
    if(board_tag.html() == undefined){
        console.log("update_display_board : cannot update display because the html was not created. See #board : " + board_tag.html());
        return;
    }
    if(board_tag.html().search("<table>") < 0){
        console.log("update_display_board : cannot update display because the html does not contain a table. See #board : " + board_tag.html());
        return;
    }

    //updating display
    for(var i = 0; i < b.height; i++){
        for(var j = 0; j < b.width; j++){
            var elt = select_stone(i, j);
            switch(b.board_of_stone[i][j]){
                case 0:
                    elt.attr('class', '');
                    break;
                case 1:
                    elt.attr('class', 'black_stone');
                    break;
                case 2:
                    elt.attr('class', 'white_stone');
                    break;
            }
        }
    }

    //updating captured stone counter
    //$("#captured_stones_black").html("<p>White has " + b.nb_captured[0].toString() + " black prisoner stones.");
    //$("#captured_stones_white").html("<p>Black has " + b.nb_captured[1].toString() + " white prisoner stones.");
}

/**
* \brief Asks the server to create a gamestate
*/
function create_gamestate(problem_id){
    function after_create_game(jqXHR){
        var data = jqXHR.responseText;
        if(filter_error(data)) return;
    }

    var req = $.get({url: "/create_game?problem_id=" + problem_id.toString(),
                     complete: after_create_game,
                     error: request_error,
                     async: false});

    function request_error(jqXHR){
        console.log("Get request to create gamestate failed.");
        display_rails_error(jqXHR);
    }
}

/**
* \brief asks the server for the current legal moves, and updates the global variable legal_moves
*/
function update_legal_moves(){
    console.log("Updating legal moves.");
    var req = $.get({url : "/get_legal",
                     complete : after_get_legal,
                     error: request_error,
                     async : false});
    function request_error(jqXHR){
        console.log("update_legal_moves() : Get request to get legal moves failed.");
        display_rails_error(jqXHR);
    }

    //FUNCTION CALLED AFTER THE GET REQUEST
    function after_get_legal(jqXHR){
        var data = jqXHR.responseText;

        if(filter_error(data)) return;
        console.log("after_get_legal() : successfully received legal moves : " + data);

        //update global variable
        try{
            legal_moves = jqXHR.responseJSON;
        }
        catch(e){
            console.log("In after_get_legal() : ");
            console.log(e.message);
        }
    }
}

/**
* \brief Updates html tags according to 'legal_moves', so that every legal moves has
*        the class "legal_move".
*/
function update_hover_moves(){
    //check if legal_move is set
    if(legal_moves == undefined){
        console.log("update_hover_moves() : cannot update html because legal_moves was not initialized");
        return;
    }

    //check if the html tags for the board are there
    var board_tag = $("#board");
    if(board_tag.html() == undefined){
        console.log("update_hover_moves() : cannot update display because the html was not created. See #board : " + board_tag.html());
        return;
    }
    if(board_tag.html().search("<table>") < 0){
        console.log("update_hover_moves() : cannot update display because the html does not contain a table. See #board : " + board_tag.html());
        return;
    }

    //update html
    for(var i = 0; i<b.height; i++){
        for(var j = 0; j<b.width; j++){
            if(legal_moves[i][j] == 1){
                select_stone(i, j).addClass("legal_move");
            }
            else{
                select_stone(i, j).removeClass("legal_move");
            }
        }
    }
    console.log("updated hover moves");
}

/**
* \brief Asks the server for the player's color and updates the global variable player_color
*/
function update_player_color(){
    console.log("Updating player's color.");

    var req = $.get("/get_color", null, after_get_color);
    req.fail(function(jqXHR){
        console.log("update_player_color() : Get request to get player color failed.");
        display_rails_error(jqXHR);
    });

    //FUNCTION CALLED AFTER THE GET REQUEST
    function after_get_color(data){
        if(filter_error(data)) return;
        console.log("after_get_color() : successfully received player color : " + data);

        player_color = parseInt(data); //update global variable

        if(player_color == undefined || isNaN(player_color || (player_color != 1 && player_color !=2))){
            console.log("after_get_color() : Could not parse player_color : " + player_color);
            return;
        }

        if(player_color == 1){
            $("#board").addClass("player_black");
        }
        else if(player_color == 2){
            $("#board").addClass("player_white");
        }
    }
}



function display_rails_error(jqXHR){
    $("#error").append(jqXHR.responseText);
}

function is_error_code(data){
    return data[0] == "E";
}

function is_message_code(data){
    return data[0] == "M";
}

function filter_error(data){
    if(! is_error_code(data)){
        return false;
    }

    if(data.search("E00") >= 0){
        console.log("E00 recieved");
        $("#error").append("<p>E00 : Le serveur n'a pas pu initialiser le fichier sgf lié a ce problème.</p>");
    }
    else if(data.search("E01") >= 0){
        console.log("E01 recieved");
        $("#error").append("<p>E01 : L'IA n'a pas réussi a retrouver l'état de la partie</p>");
    }
    else if(data.search("E02") >= 0){
        console.log("E02 recieved");
        $("#error").append("<p>E02 : Erreur IA move</p>");
    }
    else if(data.search("E03") >= 0){
        console.log("E03 recieved");
        $("#error").append("<p>E03 : Vous n'avez pas de game_state_id.</p>");
    }
    else if(data.search("E04") >= 0){
        console.log("E04 recieved");
        $("#error").append("<p>E04 : Le serveur n'a pas pu trouver de problème avec cet id.</p>");
    }
    else if(data.search("E10") >= 0){
        console.log("E10 recieved");
        $("#error").append("<p>E10 : Le coup que vous avez joué est illégal.</p>");
    }
    else {
        console.log("Unknown error recieved");
        $("#error").append("<p>Une erreur coté serveur est survenue.</p>");
    }
    return true;
}

function filter_message(data){
    if(! is_message_code(data)){
        return false;
    }

    $("#messages").empty();

    if(data.search("M20") >= 0){
        console.log("M20 recieved");
        $("#messages").append("<h4 class='win_msg'>Vous avez gagné !</h4>");
        end = true;
    }
    else if(data.search("M21") >= 0){
        console.log("M21 recieved");
        $("#messages").append("<h4 class='loose_msg'>Vous avez perdu.</h4>");
        end = true;
    }
    else{
        console.log("Unknown message recieved");
        $("#messages").append("<h4 class='loose_msg'>Le serveur a envoyé un message inconnu.</h4>");
    }
    return true;
}

function display_error(error_string){
    $("#error").append("<p>" + error_string + "</p>");
}

//html tag that has the class "board_square" and the class "middle" or "left_border" or ...
function select_square(i, j){
    return $("#" + i.toString() + "-" + j.toString());
}

//html tag that has the class "white_stone", "black_stone", "empty" or "legal_move"
function select_stone(i, j){
    return $("#" + i.toString() + "-" + j.toString() + " div");
}
