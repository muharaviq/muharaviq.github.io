const payBtn = document.querySelector(".checkout-btn");

payBtn.addEventListener("click", () =>{
    fetch("/stripe-checkout",{
        method: "post",
        headers: new Headers({ "Content-type": "application/Json"}),
        body: JSON.stringify({
            items: JSON.parse(localStorage.getItem("cart")),
        }),
    })
    .then((res) => res.json())
    .then((url) => {
        location.href = url
        clearCart();
    })
    .catch((err) => console.log(err));
});