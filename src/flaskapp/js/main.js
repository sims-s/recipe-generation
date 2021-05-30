var counter = 0;

$(document).ready(function () {
    $("#addrow").on("click", function () {
        counter = addRow(counter)
    });

    var x = document.getElementById("ingredient_text_0")
    x.addEventListener("keyup", onKeyUpIngredientText);

});

function onKeyUpIngredientText(event){
    if (event.keyCode === 13){
        this.blur()
    }
}

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

function text_startswith_quantity(text){
    words = text.split(" ")
    return isNumeric(words[0])
}

function is_empty_str(str){
    console.log(str)
    return str.trim().length===0
}

function onFocusOutIngredientList(left_focus_id){
    var table = document.getElementById("ingredient_list_table")
    var rows_to_delete = [];
    var add_another_row = false;
    console.log('left focus id: ' + left_focus_id)
    for (var i=0, row; row = table.rows[i]; i++){
        if (i==0){ continue; }
        console.log('i: ', i)
        var text_obj = row.cells[1].children[0]
        text_input = text_obj.value
        row_is_empty = is_empty_str(text_input)

        var checkbox = row.cells[0].children[0].children[0]
        if (text_obj.id==left_focus_id){
            checkbox.was_manually_set = false
        }
        if (!checkbox.was_manually_set){
            if (text_startswith_quantity(text_input)){
                checkbox.checked = true
            }else{
                checkbox.checked = false
            }
        }

        if (i==table.rows.length - 1){
            add_another_row = !row_is_empty
        } else if (row_is_empty){
            rows_to_delete.push(i)
        }
    }
    for (var i=0, delete_row; delete_row = rows_to_delete[i]; i++){
        delete_row = delete_row - i
        document.getElementById("ingredient_list_table").deleteRow(delete_row)
    }

    if (add_another_row){
        counter = addRow(counter)
    }
}

function addRow(counter, position=-1){
    counter += 1
    var table = document.getElementById("ingredient_list_table");
    var row = table.insertRow(position)
    var ingr_cell = row.insertCell(0)
    var check_cell = row.insertCell(0)

    str_counter = counter.toString()

    check_cell.innerHTML = '<td class="col-sm-1"><div class="form-check"><input class="form-check-input" type="checkbox" value="" id="qty_check_' + str_counter + '" onclick="setCheckboxClicked(this.id)" style="width: 30px; height: 30px; margin: auto;"></div></td>'
    ingr_cell.innerHTML = '<td class="col-sm-11"><input type="ingredient_text" name="ingredient_text" id="ingredient_text_' + str_counter + '" class="form-control" onfocusout="onFocusOutIngredientList(this.id)"></td>'

    var x = document.getElementById("ingredient_text_" + str_counter)
    x.addEventListener("keyup", onKeyUpIngredientText);
    x.focus();
    return counter
}

function setCheckboxClicked(clicked_id){
    var changed_box = document.getElementById(clicked_id)
    changed_box.was_manually_set = true
}

function generateRecipe(){
    document.location.href = "/test";
    var model_string = ""
    // title = document.getElementById("title_entry")
    // if (!is_empty_str(title)){
    //     model_string += title + ' '
    // }
    // var table = document.getElementById("ingredient_list_table")
    // for (var i=0, row; row = table.rows[i]; i++){
    //     if (i==0){ continue; }
    // }

    // $.ajax({
    //     type: "POST",
    //     url: "/test",
    // })
}