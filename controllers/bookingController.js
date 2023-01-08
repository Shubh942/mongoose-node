const stripe=require('stripe')('sk_test_51MNVmOSGxHRME9Sxsct2SSJBhkrVF1IST45c6kPAqaerIkEstx1Mus3W8a6JOfnyKaRvOTwS0MpnB8dE5Ueq8Uic00h0N5SDUn')
const Tour = require("./../model/tourmodel");
const Booking = require("./../model/bookingModel");
const factory=require('./handlFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getCheckoutSession=catchAsync(async(req,res,next)=>{

    const tour=await Tour.findById(req.params.tourId);

 const session=await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        success_url:`${req.protocol}://${req.get('host')}/`,
        cancel_url:`${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email:req.user.email,
        client_reference_id:req.params.tourId,
        line_items:[
            {
                name:`${tour.name} Tour`,
                description:tour.summary,
                images:[`https:www.natours.dev/img/tours/${tour.imageCover}`],
                amount:tour.price*100,
                currency:'usd',
                quantity:1
            }
        ]
    });
    res.status(200).json({
        status:'sucess',
        session
    })
});


exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
