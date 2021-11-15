// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./GalaxyCoin.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract GalaxyCoinICO is Ownable {
    using SafeMath for uint256; // Protection for underflow and overflow
    GalaxyCoin token;
    uint256 public _rate = 2700; // 1 ETH == 2700 GLX

    constructor(address _tokenAddress) {
       token = GalaxyCoin(_tokenAddress);
    }

    // Convert _weiamount into GLX Token amount and return the result
    function _getTokenAmount(uint256 _weiAmount)
        internal
        view
        returns (uint256)
    {
        return _weiAmount.mul(_rate);
    }

    // when no other function matches (not even the receive function).
    fallback () external payable {
        uint256 _amount = 50 * (10**18);
        token.transfer(msg.sender, _amount);
    }

    // for empty calldata (and any value)
    receive() external payable {
        uint256 _amount = _getTokenAmount(msg.value);
        token.transfer(msg.sender, _amount);
    }
}
