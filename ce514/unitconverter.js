function unitConverter(){
    const result = document.getElementById("result");
    const input_value = parseFloat(document.getElementById("inputValue").value);
    if (isNaN(input_value)) {
        result.textContent = "Invalid input. You should provide a valid numeric value as the input.";
        return;}
    const input_unit = document.getElementById("inputUnit").value;
    const output_unit = document.getElementById("outputUnit").value;
    const conversion_factors = {'Millimeters':[1.0, 10.0, 25.4, 304.8, 914.4, 1000.0, 1000000.0, 1609344.0], 'Centimeters':[0.1, 1.0, 2.54, 30.48, 91.44, 100.0, 100000.00, 160934.40], 'Inches':[0.0393701, 0.393701, 1.0, 12.0, 36.00001944, 39.3701, 39370.1, 63360.0342144], 'Feet':[0.0032808416666669994351, 0.03280841666667, 0.08333337833334178435, 1.0, 3.0000016200003041256, 3.280841666666999501, 3280.841666666999572, 5280.0028512005355879], 'Yards':[0.0010936138888889999563, 0.010936138888889999563, 0.027777792777780599409, 0.33333351333336719291, 1.0, 1.0936138888889999077, 1093.6138888890000089, 1760.0009504001791356], 'Meters':[0.001, 0.01, 0.0254, 0.3048, 0.9144, 1.0, 1000.0, 1609.3440], 'Kilometers':[0.000001, 0.00001, 0.0000254, 0.0003048, 0.0009144, 0.001, 1.0, 1.6093440], 'Miles':[0.0000006213711, 0.000006213711, 0.00001578283, 0.000189394, 0.000568182, 0.0006213713910761, 0.621371, 1.0]};
    const input_units = {'Millimeters':0, 'Centimeters':1, 'Inches':2, 'Feet':3, 'Yards':4, 'Meters':5, 'Kilometers':6, 'Miles':7};
    input_unit_index = input_units[input_unit];
    var output_value = conversion_factors[output_unit][input_unit_index] * input_value;
    result.innerHTML = input_value + " " + input_unit.toLowerCase() + " = <b>" + output_value + " " + output_unit.toLowerCase() + "</b>";
    }