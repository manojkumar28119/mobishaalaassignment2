import "./index.css"

const ImageItem = (props) => {
    const {item} = props
    const {imageUrl,location} = item

    return (
        <div className="item">
            <img src = {imageUrl} alt={location} className="img" />
            <p className="para">{location}</p>
        </div>
    )
} 

export default ImageItem