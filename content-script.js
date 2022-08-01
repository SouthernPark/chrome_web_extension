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
     *      link https url of the cloth
     *      use https because
     */

    let link = cloth_div.getElementsByTagName('a')[0].href;
    if (link[4] !== 's') {
        link = link.substring(0, 4) + 's' + link.substring(4);
    }

    return link;
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

function get_cloth_images(cloth_html) {
    /**
     * @param [html dom]: cloth_html
     *      The web dom of the cloth
     * @return [array]
     *      return an array containing at most three images 
     *      url about the cloth
     */

    let images_set = new Set();
    let image_buttons = cloth_html.getElementById('js-primary-slideshow__pager').getElementsByTagName('button');

    for (let i = 0; i < image_buttons.length; i++) {
        let image_button = image_buttons[i];
        images_set.add(image_button.getAttribute('data-image'));
    }

    let res = [];
    let count = 0;
    let it = images_set.values();
    for (let image_url of images_set) {
        if (count > 2) {
            break;
        }
        count++;
        res.push(image_url);
    }

    return res;
}

function get_cloth_price(cloth_html) {
    // given the cloth html dom, return the price [str] of the cloth
    // ex: '$268'
    return cloth_html.getElementById('retailPrice').textContent;
}


function get_cloth_designer(cloth_html) {
    /**
     * @param [html dom]: cloth_html
     * @return [str]: cloth designer/brand
     */

    return cloth_html.getElementsByClassName('product-brand--lg')[0].textContent.trim().split('\n')[1].trim();
}

function get_cloth_description(cloth_html) {
    /**
     * @param [html dom]: cloth_html
     * @return [array]
     *      return an array of strings describing the cloth
     */

    let des_list = cloth_html.getElementsByClassName('product-details__list')[0].getElementsByTagName('li');

    let res = [];

    for (let i = 0; i < des_list.length; i++) {
        res.push(des_list[i].textContent);
    }

    return res;

}

function fetch_cloth_info_and_send(cloth_div) {
    /**
     * @param [html div] cloth_div
     *      HMTL division contains one cloth input
     * @return 
     *      cloth object which contians the following info:
     *      cloth_link, size, color, quantity
     * @PS
     *      avoid blocking with fetch and promise call back
     */

    let name = get_cloth_name(cloth_div);
    let link = get_cloth_link(cloth_div);
    let size = get_cloth_size(cloth_div);
    let color = get_cloth_color(cloth_div);

    let cloth_obj = {
        'name': name,
        'link': link,
        'size': size,
        'color': color
    };

    // fetch cloth web page
    let request = new Request(link, {
        method: 'GET',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36 Edg/103.0.1264.77',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        host: 'www.revolve.com',
        followAllRedirects: true
    });

    // promise callback: non_blocking
    fetch(request).then(resp => resp.text()).then(data => {
        let parser = new DOMParser();
        let cloth_html = parser.parseFromString(data, 'text/html');

        cloth_obj.images = get_cloth_images(cloth_html);
        cloth_obj.price = get_cloth_price(cloth_html);
        cloth_obj.designer = get_cloth_designer(cloth_html);
        cloth_obj.describe = get_cloth_description(cloth_html);

        //send cloth objct to background service worker
        chrome.runtime.sendMessage(cloth_obj);
    });

    return;
}

function main() {

    // get shopping bag
    let clothes_html = document.getElementsByClassName("shopping-bag__prod-info");

    //for each cloth in the bag, fetch its info and send to background service worker
    for (let i = 0; i < clothes_html.length; i++) {
        // checking if it's cloth
        if (is_cloth(clothes_html[i])) {
            let cloth = fetch_cloth_info_and_send(clothes_html[i]);
        }
    }

}



// let paypal_button = document.getElementsByClassName("paypal-button")[0];

// console.log('adfasfd')



// paypal_button.addEventListener('click', function (event) {
//     alert('Hi!');
//     console.log('paypal button clicked')
// });

function add_listener() {
    let checkout_button = document.getElementById("tr-bag-proceed-checkout-btn");
    if (checkout_button !== null) {
        checkout_button.addEventListener('click', () => main());
    }

    let paypal_button = document.getElementById("paypal-button")

    if (paypal_button !== null) {
        paypal_button.addEventListener('click', () => main());
    }

}

add_listener()
