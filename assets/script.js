const menu = document.querySelector('#menu')
const cartBtn = document.querySelector('#cart-btn')
const cartModal = document.querySelector('.modal-view')
const cartItemsContainer = document.querySelector('#cart-items')
const cartTotal = document.querySelector('#cart-total')
const checkoutBtn = document.querySelector('#checkout-btn')
const closeModalBtn = document.querySelector('#close-modal-btn')
const cartCounter = document.querySelector('#cart-count')
const addressInput = document.querySelector('#address')
const addressWarn = document.querySelector('#address-warning') 

let cart = [];

// abrir modal
cartBtn.addEventListener('click', () => {
    updatedCartModal()
    cartModal.style.display = "flex"
})

// fechar modal
cartModal.addEventListener('click', (e) => {
    if(e.target === cartModal) {
        cartModal.style.display = 'none'
    }
})

closeModalBtn.addEventListener('click', () => {
    cartModal.style.display = 'none'
})

menu.addEventListener('click', (e) => {
    let parentBtn = e.target.closest('.add-btn')

    if(parentBtn) {
        const name = parentBtn.getAttribute('data-name')
        const price = parseFloat(parentBtn.getAttribute('data-price'))

        addToCart(name, price)
    }
})


const addToCart = (name, price) => {
    const hasItem = cart.find(item => item.name === name)

    if(hasItem) {
        hasItem.quantity += 1; 
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    Toastify({
        text: "Item adicionado ao carrinho!",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#00b09b",
        },
      }).showToast();

    updatedCartModal()
}

const updatedCartModal = () => {
    cartItemsContainer.innerHTML = "";
    
    let total = 0;
    
    cart.forEach(item => {
        const cartItemElement = document.createElement('div')
        cartItemsContainer.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between rounded border-gray-100 mb-2 p-3">
          <div>
            <p class="font-medium">${item.name}</p>
            <p>${item.quantity}</p>
            <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
          </div>

          <button class="remove-item-cart-btn border-red-500 text-red-500 rounded py-1 px-2" data-name="${item.name}">
            Remover
          </button>
        </div>
        ` 

        total += item.price * item.quantity

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerText = `( ${cart.length} )` 
}

cartItemsContainer.addEventListener('click', (e) => {
    if(e.target.classList.contains('remove-item-cart-btn')) {
        const name = e.target.getAttribute('data-name')

        removeItemCart(name)
    }
})

const removeItemCart = (name) => {
    const index = cart.findIndex(item => item.name === name)    

    if(index !== -1) {
        const item = cart[index]

        if(item.quantity > 1) {
            item.quantity -= 1;
            updatedCartModal();
            return;
        }

        cart.splice(index, 1)
        updatedCartModal();
    }
}


addressInput.addEventListener('input', (e) => {
    let inputValue = e.target.inputValue
    
    if(inputValue !== "") {
        addressInput.classList.remove('border-red-500')
        addressWarn.classList.add('hidden')
    }
})


checkoutBtn.addEventListener('click', () => {

    const isOpen = checkRestaurantOpen();
    if(!isOpen) {
        Toastify({
            text: "O Restaurante está fechado no momento.",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
          }).showToast();
        

        return
    }

    if(cart.length === 0) return

    if(addressInput.value === '') {
        addressWarn.classList.remove('hidden')
        addressInput.classList.add('border-red-500')
        return
    }

    // enviar para o WPP
    const cartItems = cart.map((item) => {
        return (
            `${item.name}, Quantidade: (${item.quantity}), Valor: R$${item.price} | `
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "16981357811"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updatedCartModal();
})


const checkRestaurantOpen = () => {
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora < 22;
}

const TimeRestaurant = document.querySelector('#date-span')
const isOpen = checkRestaurantOpen()

if(isOpen) {
    TimeRestaurant.classList.remove('bg-red-500')
    TimeRestaurant.classList.add('bg-green-600')
} else {
    TimeRestaurant.classList.add('bg-red-500')
    TimeRestaurant.classList.remove('bg-green-600')
}