
//ICON IMPORTS
import roomDetIcon from '../assets/room-details.svg';
import aboutSpaceIcon from '../assets/about-space.svg';


import { useForm } from 'react-hook-form';

function ManagerCreate() {
  const { register, handleSubmit } = useForm();


  const onSubmit = (data) => {
    console.log(data);

  };
  return (
    <div className="man-create-main container-fluid d-flex flex-column gap-4 p-3 justify-content-center align-items-center">
      <form onSubmit={handleSubmit(onSubmit)} className='container-fluid d-flex flex-column gap-4'>
        <div className="d-flex flex-column calloutTitle justify-content-center align-items-center">
          <h1>List a Room</h1>
          <p>Fill in the details below to publish your room to roomies</p>
        </div>
        {/* CARD1 : ROOM TITLE CONTAINER*/}

        <div className="card shadow container p-5">
          <div className="blockHeader d-flex flex-row border-bottom pb-0 gap-2">
            <img src={roomDetIcon} alt="" />
            <h1>Room Details</h1>
          </div>
          <div className="roomTitleInputcontainer">
            <p>Room Title</p>
            <input {...register("roomTitle")} type="text" className="border p-2" placeholder=' e.g 2-Torre Lorenzo | One bedroom 4 beds' />
          </div>

          <div className="priceAndMoveContainer gap-3 d-flex flex-row justify-content-between">
            <div className="priceInputContainer d-flex flex-column container-fluid ">
              <p>Rate per Month</p>
              <input {...register("price")} type="number" className='border p-2' />
            </div>
            <div className="genderPreference d-flex flex-column container-fluid" >
              <p>Gender Restrictions</p>
              <select {...register("gender")} className="form-select">
                <option value="co-ed">Co-ed: No restrictions</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* CARD2 : About the space */}

        <div className="card shadow container p-5">
          <div className="blockHeader d-flex flex-row border-bottom pb-0 gap-2">
            <img src={aboutSpaceIcon} alt="" />
            <h1>Avout the Space</h1>
          </div>
          <div className="roomTitleInputcontainer">
            <p>Description</p>
            <textarea {...register("description")} name="" id=""></textarea>
          </div>

          <div className="priceAndMoveContainer gap-3 d-flex flex-row">
            <div className="priceInputContainer d-flex flex-column ">
              <p>Rate per Month</p>
              <input {...register("price")} type="number" className='border p-2' />
            </div>
            <div className="genderPreference d-flex flex-column" >
              <p>Gender Restrictions</p>
              <select {...register("gender")} className="form-select">
                <option value="co-ed">Co-ed: No restrictions</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        </div>








        <button type="submit" className='btn btn-primary'>submit</button>
      </form>
    </div>
  )

}

export default ManagerCreate
