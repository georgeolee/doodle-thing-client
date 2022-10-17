export function User(props){
    const {
        id,
        name,
        status,
        color,
    } = props;

    return (
        <li key={id}>
            <div>{name}</div>
            <div>{color}</div>
            <div>{status}</div>
        </li>
    )
}