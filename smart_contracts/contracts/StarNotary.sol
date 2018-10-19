pragma solidity ^0.4.23;

import "./node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 { 
    
    struct Star { 
        string name;
        string dec;
        string mag;
        string cent;  
        string story;
    }

    Star[] public starsArray;
    bytes32[] internal starsIdArray;
    mapping(uint256 => uint256) public starsForSale;

    event test_value(uint256 indexed value1);

    // main

    function createStar(string _name, string _dec, string _mag, string _cent, string _story) public {
        Star memory newStar = Star(_name, _dec, _mag, _cent, _story);
        if (!checkIfStarExists(_dec, _mag, _cent)) {
            starsArray.push(newStar);
            mint(msg.sender, starsArray.length);
        } 
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public { 
        require(this.ownerOf(_tokenId) == msg.sender);
        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable { 
        require(starsForSale[_tokenId] > 0);
        
        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);
        
        starOwner.transfer(starCost);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
    }

    function checkIfStarExists(string _dec, string _mag, string _cent) public view returns (bool){
        // We know the length of the array
        uint arrayLength = starsArray.length;

        if (arrayLength < 1) {
            return false;
        }
        
        for (uint i = 0; i < arrayLength; i++) {
            if (areCoordinatesEqual(_dec, _mag, _cent, starsArray[i].dec, starsArray[i].mag, starsArray[i].cent)) {
                return true;
            }
        }

        return false;
    }

    function tokenIdToStarInfo(uint256 _tokenId) public view returns (string name, string story, string cent, string dec, string mag) {
        Star memory _star = starsArray[_tokenId];
        return (_star.name, _star.story, _star.cent, _star.dec, _star.mag);
    }


    function mint(address to, uint256 tokenId) public {
        require(to != address(0));
        _addTokenTo(to, tokenId);
        emit Transfer(address(0), to, tokenId);
    }

    function getStarName(uint _tokenId) public view returns (string) {
        return starsArray[_tokenId].name;
    }

    function getLatestAddedStarId() public view returns (uint) {
        return starsArray.length;
    }

    // tools

    

    function areCoordinatesEqual(string _dec1, string _mag1, string _cent1, string _dec2, string _mag2, string _cent2) internal pure returns (bool) {
        bytes memory _coordinates1 = generateCoordinatesHash(_dec1, _mag1, _cent1);
        bytes memory _coordinates2 = generateCoordinatesHash(_dec2, _mag2, _cent2);
        return compareBytesArray(_coordinates1, _coordinates2);
    }

    function generateCoordinatesHash(string _dec, string _mag, string _cent) internal pure returns (bytes) {
        bytes memory decBytes = bytes(_dec);
        bytes memory magBytes = bytes(_mag);
        bytes memory centBytes = bytes(_cent);
        bytes memory allBytes = bytesConcat(decBytes, magBytes, centBytes);
        return allBytes;
    }

    function bytesConcat(bytes _ba, bytes _bb, bytes _bc) internal pure returns (bytes) {
        string memory abcde = new string(_ba.length + _bb.length + _bc.length);
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
        for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
        return babcde;
    }

    function compareBytesArray(bytes a, bytes b) internal pure returns (bool) {
        if(bytes(a).length != bytes(b).length) {
            return false;
        } else {
            return keccak256(a) == keccak256(b);
        }
    }

}