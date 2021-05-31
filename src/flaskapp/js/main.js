var counter = 0;

$(document).ready(function () {
    // Ingredient entry text box creates a new one when it loses focus
    var x = document.getElementById("ingredient_text_0")
    x.addEventListener("keyup", onKeyUpIngredientText);

    // Submit if enter pressed anywhere otuside textbox
    document.addEventListener("keyup", enterPressButton);
    // Press enter in title box --> go to ingredietns list
    document.getElementById("title_entry").addEventListener("keyup", enterMoveTitleToIngr)

});


function active_element_is_in_ingredient_list(element_id){
    return element_id.startsWith("ingredient_text_")

}
// Pressing Enter when no text box has focus
function enterPressButton(event){
    if (event.keyCode === 13){
        var active_element_id = document.activeElement.id
        if (active_element_is_in_ingredient_list(active_element_id)){return}
        document.getElementById("generate_recipe_button").click()
    }
};
// Press enter in title box --> go to ingredietns list
function enterMoveTitleToIngr(event){
    if (event.keyCode === 13){
        var table = document.getElementById("ingredient_list_table")
        var selected_id = "" 
        for (var i=0, row; row = table.rows[i]; i++){
            if (i==0){continue; }
            console.log(row.cells[1])
            if (is_empty_str(row.cells[1].children[0].value)){
                selected_id = row.cells[1].children[0].id
            }
        }
        document.getElementById(selected_id).focus()
    }
}
// Leave focuys from ingrdient entry when enter pressed
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
    return str.trim().length===0
}

function onFocusOutIngredientList(left_focus_id){
    var table = document.getElementById("ingredient_list_table")
    var rows_to_delete = [];
    var add_another_row = false;
    // For each row in the ingredient table
    for (var i=0, row; row = table.rows[i]; i++){
        // Skip the header row
        if (i==0){ continue; }
        var text_obj = row.cells[1].children[0]
        text_input = text_obj.value
        row_is_empty = is_empty_str(text_input)

        // If the ingredient was just updated, then the user hasnt' changed it manually
        var checkbox = row.cells[0].children[0].children[0]
        if (text_obj.id==left_focus_id){
            checkbox.was_manually_set = false
        }
        // If the checkbox wasn't maunually set by the user and it seems to start with a quantity, then set it autoamitaclly
        if (!checkbox.was_manually_set){
            if (text_startswith_quantity(text_input)){
                checkbox.checked = true
            }else{
                checkbox.checked = false
            }
        }
        // When we get to the last row, check if it's empty. If it's not, then we want to add an empty row
        // Additionally, mark rows that are empty that aren't the last one for deletion
        if (i==table.rows.length - 1){
            add_another_row = !row_is_empty
        } else if (row_is_empty){
            rows_to_delete.push(i)
        }
    }
    // Delete selected rows
    for (var i=0, delete_row; delete_row = rows_to_delete[i]; i++){
        delete_row = delete_row - i
        document.getElementById("ingredient_list_table").deleteRow(delete_row)
    }
    // Add a row if we're supposed to
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

    // check_cell.innerHTML = '<td class="col-sm-1"><div class="form-check"><input class="form-check-input" type="checkbox" value="" id="qty_check_' + str_counter + '" onclick="setCheckboxClicked(this.id)" style="width: 30px; height: 30px; margin: auto;"></div></td>'
    check_cell.innerHTML = '<td class="col-sm-1"><div class="form-check"><input class="form-check-input" type="checkbox" value="" id="qty_check_' + str_counter + '" onclick="setCheckboxClicked(this.id)" style="width: 30px; height: 30px; margin: auto;"></div></td>'
    ingr_cell.innerHTML = '<td class="col-sm-11"><input type="ingredient_text" name="ingredient_text" id="ingredient_text_' + str_counter + '" class="form-control" onfocusout="onFocusOutIngredientList(this.id)"></td>'

    var x = document.getElementById("ingredient_text_" + str_counter)
    x.addEventListener("keyup", onKeyUpIngredientText);
    x.focus();
    return counter
}

function getIngredientsForInput(){
    var table = document.getElementById("ingredient_list_table")
    ingredients = []
    contain_quantity = []

    for (var i=0, row; row = table.rows[i]; i++){
        // Skip the header row
        if (i==0){ continue; }
        checked = row.cells[0].children[0].children[0].checked
        text = row.cells[1].children[0].value

        if (!is_empty_str(text)){
            ingredients.push(text)
            contain_quantity.push(checked)
        }
    }
    // console.log(ingredients)
    // console.log(contain_quantity)
    return [ingredients, contain_quantity]

}

function generateRecipe(){
    ingredients_and_are_quantity = getIngredientsForInput();
    console.log(ingredients_and_are_quantity)

    ingredients = ingredients_and_are_quantity[0]
    ingredients_have_quantity = ingredients_and_are_quantity[1]

    $.ajax({
        type: "POST",
        url: "/query",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            title: document.getElementById("title_entry").value,
            ingredients: ingredients,
            ingredient_contains_quantity: ingredients_have_quantity,
            allow_additional_ingredients: document.getElementById("addtl_ingr_check").checked
        }),
        success: function(response){
            console.log(response)
            var ingredient_list = document.getElementById("generated_ingredient_list")
            var instruction_list = document.getElementById("generated_instructions")

            ingredient_list.value = response['ingredients']
            instruction_list.value = response['instructions']

            spinner = document.getElementById("button_spinner")
            spinner.hidden = true
            

        },
        beforeSend: function(){
            spinner = document.getElementById("button_spinner")
            spinner.hidden = false
            button = document.getElementById("generate_recipe_button")
        }
    })
}

function setCheckboxClicked(clicked_id){
    var changed_box = document.getElementById(clicked_id)
    changed_box.was_manually_set = true
}