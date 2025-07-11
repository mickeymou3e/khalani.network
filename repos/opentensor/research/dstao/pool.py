class Pool:
    # Initialize the pool with initial internal reserves
    # -- (tao_in): Amount of TAO in the pool.
    # -- (alpha_in): Amount of ALPHA in the pool.
    # -- (alpha_out): Amount of ALPHA outstanding (in the network)
    def __init__(
        self,
        netuid: str,
        tao_in: float = 1e-9,
        alpha_in: float = 1e-9,
        alpha_out: float = 0,
    ):
        self.name: str = netuid
        self.tao_in: float = tao_in
        self.alpha_in: float = alpha_in
        self.alpha_out: float = alpha_out
        self.k: float = self.tao_in * self.alpha_in

    # Helpers
    def __str__(self) -> str:
        return f"P( {self.tao_in}, {self.alpha_in}, {self.alpha_out}, {self.price})"

    def __repr__(self) -> str:
        return self.__str__()

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "tao_in": self.tao_in,
            "alpha_in": self.alpha_in,
            "alpha_out": self.alpha_out,
            "k": self.k,
            "price": self.price,
            "market_cap": self.market_cap,
        }

    def from_dict(self, d: dict) -> None:
        self.name = d["name"]
        self.tao_in = d["tao_in"]
        self.alpha_in = d["alpha_in"]
        self.alpha_out = d["alpha_out"]
        self.k = d["k"]

    @property
    def price(self) -> float:
        return self.tao_in / self.alpha_in

    @property
    def market_cap(self) -> float:
        return self.price * self.alpha_out

    # Return the amount of ALPHA if we were to buy with the passed TAO (does not change the pool)
    def simbuy(self, tao: float) -> float:
        new_tao_in = self.tao_in + tao
        new_alpha_in = self.k / new_tao_in
        alpha_out = self.alpha_in - new_alpha_in
        return alpha_out

    # Return the amount of TAO if were to sell with the passed ALPHA (does not change the pool)
    def simsell(self, alpha: float) -> float:
        new_alpha_in = self.alpha_in + alpha
        new_tao_in = self.k / new_alpha_in
        tao_out = self.tao_in - new_tao_in
        return tao_out

    # Perform a buy operation with the passed TAO and return the ALPHA bought (changes the pool reserves)
    def buy(self, tao: float) -> float:
        new_tao_in = self.tao_in + tao
        new_alpha_in = self.k / new_tao_in
        alpha_out = self.alpha_in - new_alpha_in
        self.alpha_out += alpha_out
        self.tao_in = new_tao_in
        self.alpha_in = new_alpha_in
        return alpha_out

    # Perform a sell operation with the passed ALPHA and return the TAO bought (changes the pool reserves)
    def sell(self, alpha: float) -> float:
        new_alpha_in = self.alpha_in + alpha
        new_tao_in = self.k / new_alpha_in
        tao_out = self.tao_in - new_tao_in
        self.alpha_out -= alpha
        self.alpha_in = new_alpha_in
        self.tao_in = new_tao_in
        return tao_out

    # Adds TAO, ALPHA and ALPHA_OUTSTANDING to the pool changing the K param.
    def inject(self, tao_in: float, alpha_in: float, alpha_out: float) -> None:
        self.tao_in += tao_in
        self.alpha_in += alpha_in
        self.alpha_out += alpha_out
        self.k = self.tao_in * self.alpha_in
