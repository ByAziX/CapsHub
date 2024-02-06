// Assurez-vous que SortFilter met à jour l'URL en fonction du tri sélectionné
import { useRouter } from 'next/router';

const SortFilterNFT: React.FC<{ value: string }> = ({ value }) => {
    const router = useRouter();

    const handleChange = (newValue: string) => {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, NFTSort: newValue }, 
        });
    };

    return (
        <select value={value} onChange={(e) => handleChange(e.target.value)}>
            <option value="TIMESTAMP_CREATED_DESC">Most recent</option>
            <option value="TIMESTAMP_CREATED_ASC">Oldest</option>
            <option value="TIMESTAMP_LISTED_DESC">Recent listing</option>
            <option value="TIMESTAMP_LISTED_ASC">oldest listing</option>
            <option value="PRICE_ROUNDED_ASC">Cheapest</option>
            <option value="PRICE_ROUNDED_DESC">Most expensive</option>
            <option value="TIMESTAMP_LISTED_ASC">Most liked</option>
            <option value="TIMESTAMP_LISTED_ASC">Lowest royalty</option>
            <option value="TIMESTAMP_LISTED_ASC">Highest royalty</option>
            <option value="TIMESTAMP_LISTED_ASC">Collection asc</option>
            <option value="TIMESTAMP_LISTED_ASC">Collection desc</option>
            <option value="TIMESTAMP_LISTED_ASC">recent rent contract</option>
            <option value="TIMESTAMP_LISTED_ASC">oldest rent contract</option>

        </select>
    );
};

export default SortFilterNFT;