import React from 'react'
import { useGetOrderByEmailQuery } from '../../redux/features/orders/ordersApi'
import { useAuth } from '../../context/Auth.Context';

const OrderPage = () => {
    const {currentUser} = useAuth()
    const {data: orders=[], isLoading, isError} = useGetOrderByEmailQuery(currentUser?.email);
    
    // Fixed: Logic was inverted - should show loading when isLoading is TRUE
    if (isLoading) return <div>Loading...</div>
    // Fixed: Logic was inverted - should show error when isError is TRUE  
    if (isError) return <div>Error getting orders data</div>
    
    return (
        <div className='container mx-auto p-6'>
            <h2 className='text-2xl font-semibold mb-4'>Your Orders</h2>
            {
                orders.length === 0 ? (
                    <div>No orders found</div> 
                ) : (
                    <div> 
                        {
                            orders.map((order, index) => (
                                <div key={order?._id || index} className='border-b mb-4 pb-4'> 
                                    <p className='p-1 bg-secondary text-white w-10 rounded mb-1'># {index +1}</p>
                                    <h2 className='font-bold' >OrderId: {order?._id}</h2>
                                    <p className='text-gray-600'>Name: {order?.name}</p>
                                    <p className='text-gray-600'>Email: {order?.email}</p>
                                    <p className='text-gray-600'>phone: {order?.phone}</p>
                                    <p className='text-gray-600'>Total Price: {order?.totalprice}</p>
                                    <h3 className='font-semibold mt-2'>Address: </h3>
                                     <p>{order.address.city}, {order.address.state}, {order.address.country}, 
                                        {order.address.zipcode}</p>
                                    <h3 className='font-semibold mt-2'>Products Id: </h3>
                                    <ul>
                                        {order.productIds.map((productId) => (
                                            <li key={productId}>{productId}</li>
                                        ))}
                                    </ul>  
                                </div>    
                            ))
                        }
                    </div>
                ) 
            }
        </div>
    )
}

export default OrderPage;











// import React from 'react'
// import { useGetOrderByEmailQuery } from '../../redux/features/orders/ordersApi'
// import { useAuth } from '../../context/Auth.Context';

// const OrderPage = () => {
//     const {currentUser} = useAuth()
//     const {data: orders=[], isLoading, isError} = useGetOrderByEmailQuery(currentUser.email);
//     if (!isLoading) return <div>Loading...</div>
//     if (!isError) return <div>Error getting orders data</div>
//   return (
//     <div className='container mx-auto  p-6'>
//         <h2 className='text-2xl font-semibold mb-4'>Your Orders</h2>
//         {
//             orders.length === 0 ? (<div>No orders found</div> ) : (<div>
//                 {
//                     orders.map((order, index) => (
//                         <div>  
//                         <h3>OrderId: {order?._id}</h3>
//                         </div>    
//                     ))
//                 }
//             </div>) 
//         }
//     </div>
//   )
// }

// export default OrderPage;
 