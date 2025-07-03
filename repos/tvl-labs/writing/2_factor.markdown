# 2 Factor validation

## Motivation

Most ABMs provide a single validation mode. While each bridge has itw own compromises with regards to security and latency, we believe that relying on a single validation mechanism is naive; any flaws or attack on that mechanism renders the applications that rely on it open to attacks.

# Proposed Solution

We will incorporate 2 factors ; additional validation mechanisms / security buffers to reinforce the AMB's primary validation.


## Implementation

### Hyperlane


![ISM](./.assets/ISM.png)

- Hyperlane adopts the concept of Sovereign consensus, allowing applications to either use the default multi sig ISM , in addition to a Khalani ISM.
- An additional ISM contract would conform to the Hyperlane's ISM interface , with the verification logic being
        

        ```solidity

        import "./IKhalaniISM.sol";
        import "./IHyperlaneISM.sol";

            /**
           * @notice Verifies the both the Khalani and Hyperlane Validator sets have 
           * reached a quorum on the checkpointed message.
           * checkpoint.
           * @param _metadata ABI encoded module metadata (see MultisigIsmMetadata.sol)
           * @param _message Formatted Hyperlane message (see Message.sol).
           */
          function verify()
              public
              view
              returns (bool)
          {
              require(khalaniISM.verify(), "!khalaniISM");
              require(hyperlaneISM.verify(), "!hyperlaneISM");
              return true;
          }
    ```


### Celer

Celer allows for configuring application parameters to accept or reject message based on the results of watch towers. It is currently not clear how this works and is being investigated.