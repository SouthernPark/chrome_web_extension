/**
 * add listener on the following buttons on web https://www.revolve.com/r/ShoppingBag.jsp
 * 1. tr-bag-proceed-checkout-btn 
 * 2. var buttonsContainer = document.getElementsByClassName("paypal-button-container")[0];
 */

function is_cloth(cloth_div) {
    /** 
     * @param [html div] cloth_div
     *      HMTL division contains one cloth input
     * @return
     *      true if it's close, otherwise false
     * @how
     *      Cloth has size while makeup does not
     *      using style.display == 'none' to classify them
     * 
    */

    let size_tag = cloth_div.getElementsByClassName("shopbag_item_size")[0];

    let size_display = size_tag.style.display;

    if (size_display === 'none') {
        console.log(get_cloth_name(cloth_div) + " is not cloth");
        return false;
    }
    else {
        return true;
    }
}

function get_cloth_name(cloth_div) {
    /**
     * @param [html div] cloth_div
     *      HMTL division contains one cloth input
     * @return[str] 
     *      name of the cloth
     */

    return cloth_div.querySelectorAll('div strong')[0].textContent;
}

function get_cloth_link(cloth_div) {

    /**
     * @param [html div] cloth_div
     *      HMTL division contains one cloth input
     * @return[str] 
     *      link url of the cloth
     */

    return cloth_div.getElementsByTagName('a')[0].href;
}

function get_cloth_size(cloth_div) {
    /**
     * @param [html div] cloth_div
     *      HMTL division contains one cloth input
     * @return[str] 
     *      size of the cloth
     */

    let size_text = cloth_div.getElementsByClassName("shopbag_item_size")[0].textContent;

    return size_text.trim().match(/Size: (.*)/)[1];
}

function get_cloth_color(cloth_div) {
    /**
     * @param [html div] cloth_div
     *      HMTL division contains one cloth input
     * @return[str] 
     *      color of the cloth if has
     *      otherwise return 'none'
     */

    let possible_tags = cloth_div.querySelectorAll('div span');

    for (let i = 0; i < possible_tags.length; i++) {
        let trimed_txt = possible_tags[i].textContent.trim();
        let mat = trimed_txt.match(/Color: (.*)/);
        if (mat !== null) {
            return mat[1];
        }
    }
    return 'none'
}


function make_cloth_obj(cloth_div) {
    /**
     * @param [html div] cloth_div
     *      HMTL division contains one cloth input
     * @return 
     *      cloth object which contians the following info:
     *      cloth_link, size, color, quantity
     */

    let name = get_cloth_name(cloth_div);
    let link = get_cloth_link(cloth_div);
    let size = get_cloth_size(cloth_div);
    let color = get_cloth_color(cloth_div);

    return {
        'name': name,
        'link': link,
        'size': size,
        'color': color
    };
}

function fetch_clothes_info() {

    /**
     * @return
     *      an array of cloth objects containing cloth info
     */

    let clothes = [];   // array to hold cloth object

    // HTMLCollection contains multi div
    let clothes_html = document.getElementsByClassName("shopping-bag__prod-info");

    for (let i = 0; i < clothes_html.length; i++) {
        // if it is cloth
        if (is_cloth(clothes_html[i])) {
            let cloth = make_cloth_obj(clothes_html[i]);
            clothes.push(cloth);
        }
    }

    return clothes;

}



// let paypal_button = document.getElementsByClassName("paypal-button")[0];

// console.log('adfasfd')



// paypal_button.addEventListener('click', function (event) {
//     alert('Hi!');
//     console.log('paypal button clicked')
// });


let checkout_button = document.getElementById("tr-bag-proceed-checkout-btn");

checkout_button.addEventListener('click', () => {
    fetch_clothes_info();
});