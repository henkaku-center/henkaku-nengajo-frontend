/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../../common";

export interface IOtakiageInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "approve"
      | "balanceOf"
      | "batchMintOtakiage"
      | "fetchHoldingOmamoriBalance"
      | "getApproved"
      | "getCID"
      | "getImage"
      | "getOtakiageUserCount"
      | "getOtakiageUserOmamoriIds"
      | "getOtakiageUserOmamoriIdsCount"
      | "getOtakiageUsersArr"
      | "isApprovedForAll"
      | "mintOtakiage"
      | "otakiage"
      | "ownerOf"
      | "recordOtakiageUser"
      | "recordOtakiageUsers"
      | "safeTransferFrom(address,address,uint256)"
      | "safeTransferFrom(address,address,uint256,bytes)"
      | "sendAllOmamori"
      | "setApprovalForAll"
      | "setCID"
      | "setImageExtension"
      | "setOmamoriAddress"
      | "setOmamoriTokenIdOffset"
      | "setOmamoriTypeCount"
      | "supportsInterface"
      | "tokenURI"
      | "transferFrom"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "Approval"
      | "ApprovalForAll"
      | "Mint"
      | "OtakiageEvent"
      | "SendAllOmamori"
      | "Transfer"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "approve",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "batchMintOtakiage",
    values: [AddressLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "fetchHoldingOmamoriBalance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getApproved",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "getCID", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getImage",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getOtakiageUserCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getOtakiageUserOmamoriIds",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getOtakiageUserOmamoriIdsCount",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getOtakiageUsersArr",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isApprovedForAll",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "mintOtakiage",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "otakiage", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "ownerOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "recordOtakiageUser",
    values: [AddressLike, BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "recordOtakiageUsers",
    values: [AddressLike[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom(address,address,uint256)",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom(address,address,uint256,bytes)",
    values: [AddressLike, AddressLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "sendAllOmamori",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setApprovalForAll",
    values: [AddressLike, boolean]
  ): string;
  encodeFunctionData(functionFragment: "setCID", values: [string]): string;
  encodeFunctionData(
    functionFragment: "setImageExtension",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setOmamoriAddress",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setOmamoriTokenIdOffset",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setOmamoriTypeCount",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenURI",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "batchMintOtakiage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fetchHoldingOmamoriBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getCID", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getImage", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getOtakiageUserCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOtakiageUserOmamoriIds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOtakiageUserOmamoriIdsCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOtakiageUsersArr",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "mintOtakiage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "otakiage", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "recordOtakiageUser",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "recordOtakiageUsers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom(address,address,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom(address,address,uint256,bytes)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "sendAllOmamori",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setApprovalForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setCID", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setImageExtension",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setOmamoriAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setOmamoriTokenIdOffset",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setOmamoriTypeCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
}

export namespace ApprovalEvent {
  export type InputTuple = [
    owner: AddressLike,
    approved: AddressLike,
    tokenId: BigNumberish
  ];
  export type OutputTuple = [owner: string, approved: string, tokenId: bigint];
  export interface OutputObject {
    owner: string;
    approved: string;
    tokenId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ApprovalForAllEvent {
  export type InputTuple = [
    owner: AddressLike,
    operator: AddressLike,
    approved: boolean
  ];
  export type OutputTuple = [
    owner: string,
    operator: string,
    approved: boolean
  ];
  export interface OutputObject {
    owner: string;
    operator: string;
    approved: boolean;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace MintEvent {
  export type InputTuple = [to: AddressLike, tokenId: BigNumberish];
  export type OutputTuple = [to: string, tokenId: bigint];
  export interface OutputObject {
    to: string;
    tokenId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OtakiageEventEvent {
  export type InputTuple = [users: AddressLike[]];
  export type OutputTuple = [users: string[]];
  export interface OutputObject {
    users: string[];
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace SendAllOmamoriEvent {
  export type InputTuple = [
    from: AddressLike,
    ids: BigNumberish[],
    values: BigNumberish[]
  ];
  export type OutputTuple = [from: string, ids: bigint[], values: bigint[]];
  export interface OutputObject {
    from: string;
    ids: bigint[];
    values: bigint[];
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TransferEvent {
  export type InputTuple = [
    from: AddressLike,
    to: AddressLike,
    tokenId: BigNumberish
  ];
  export type OutputTuple = [from: string, to: string, tokenId: bigint];
  export interface OutputObject {
    from: string;
    to: string;
    tokenId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface IOtakiage extends BaseContract {
  connect(runner?: ContractRunner | null): IOtakiage;
  waitForDeployment(): Promise<this>;

  interface: IOtakiageInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  approve: TypedContractMethod<
    [to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  balanceOf: TypedContractMethod<[owner: AddressLike], [bigint], "view">;

  batchMintOtakiage: TypedContractMethod<
    [tos: AddressLike[]],
    [void],
    "nonpayable"
  >;

  fetchHoldingOmamoriBalance: TypedContractMethod<
    [],
    [[bigint[], bigint[]]],
    "view"
  >;

  getApproved: TypedContractMethod<[tokenId: BigNumberish], [string], "view">;

  getCID: TypedContractMethod<[], [string], "view">;

  getImage: TypedContractMethod<[tokenId: BigNumberish], [string], "view">;

  getOtakiageUserCount: TypedContractMethod<[], [bigint], "view">;

  getOtakiageUserOmamoriIds: TypedContractMethod<
    [user: AddressLike],
    [bigint[]],
    "view"
  >;

  getOtakiageUserOmamoriIdsCount: TypedContractMethod<
    [user: AddressLike],
    [bigint],
    "view"
  >;

  getOtakiageUsersArr: TypedContractMethod<[], [string[]], "view">;

  isApprovedForAll: TypedContractMethod<
    [owner: AddressLike, operator: AddressLike],
    [boolean],
    "view"
  >;

  mintOtakiage: TypedContractMethod<[to: AddressLike], [void], "nonpayable">;

  otakiage: TypedContractMethod<[], [void], "nonpayable">;

  ownerOf: TypedContractMethod<[tokenId: BigNumberish], [string], "view">;

  recordOtakiageUser: TypedContractMethod<
    [user: AddressLike, omamoriIds: BigNumberish[]],
    [void],
    "nonpayable"
  >;

  recordOtakiageUsers: TypedContractMethod<
    [users: AddressLike[], omamoriIds: BigNumberish[]],
    [void],
    "nonpayable"
  >;

  "safeTransferFrom(address,address,uint256)": TypedContractMethod<
    [from: AddressLike, to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  "safeTransferFrom(address,address,uint256,bytes)": TypedContractMethod<
    [
      from: AddressLike,
      to: AddressLike,
      tokenId: BigNumberish,
      data: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  sendAllOmamori: TypedContractMethod<[], [void], "nonpayable">;

  setApprovalForAll: TypedContractMethod<
    [operator: AddressLike, approved: boolean],
    [void],
    "nonpayable"
  >;

  setCID: TypedContractMethod<[_cid: string], [void], "nonpayable">;

  setImageExtension: TypedContractMethod<
    [_imageExtension: string],
    [void],
    "nonpayable"
  >;

  setOmamoriAddress: TypedContractMethod<
    [_omamoriAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  setOmamoriTokenIdOffset: TypedContractMethod<
    [_omamoriTokenIdOffset: BigNumberish],
    [void],
    "nonpayable"
  >;

  setOmamoriTypeCount: TypedContractMethod<
    [_omamoriTypeCount: BigNumberish],
    [void],
    "nonpayable"
  >;

  supportsInterface: TypedContractMethod<
    [interfaceId: BytesLike],
    [boolean],
    "view"
  >;

  tokenURI: TypedContractMethod<[tokenId: BigNumberish], [string], "view">;

  transferFrom: TypedContractMethod<
    [from: AddressLike, to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "approve"
  ): TypedContractMethod<
    [to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "balanceOf"
  ): TypedContractMethod<[owner: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "batchMintOtakiage"
  ): TypedContractMethod<[tos: AddressLike[]], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "fetchHoldingOmamoriBalance"
  ): TypedContractMethod<[], [[bigint[], bigint[]]], "view">;
  getFunction(
    nameOrSignature: "getApproved"
  ): TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "getCID"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getImage"
  ): TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "getOtakiageUserCount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getOtakiageUserOmamoriIds"
  ): TypedContractMethod<[user: AddressLike], [bigint[]], "view">;
  getFunction(
    nameOrSignature: "getOtakiageUserOmamoriIdsCount"
  ): TypedContractMethod<[user: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "getOtakiageUsersArr"
  ): TypedContractMethod<[], [string[]], "view">;
  getFunction(
    nameOrSignature: "isApprovedForAll"
  ): TypedContractMethod<
    [owner: AddressLike, operator: AddressLike],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "mintOtakiage"
  ): TypedContractMethod<[to: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "otakiage"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "ownerOf"
  ): TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "recordOtakiageUser"
  ): TypedContractMethod<
    [user: AddressLike, omamoriIds: BigNumberish[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "recordOtakiageUsers"
  ): TypedContractMethod<
    [users: AddressLike[], omamoriIds: BigNumberish[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "safeTransferFrom(address,address,uint256)"
  ): TypedContractMethod<
    [from: AddressLike, to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "safeTransferFrom(address,address,uint256,bytes)"
  ): TypedContractMethod<
    [
      from: AddressLike,
      to: AddressLike,
      tokenId: BigNumberish,
      data: BytesLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "sendAllOmamori"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setApprovalForAll"
  ): TypedContractMethod<
    [operator: AddressLike, approved: boolean],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setCID"
  ): TypedContractMethod<[_cid: string], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setImageExtension"
  ): TypedContractMethod<[_imageExtension: string], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setOmamoriAddress"
  ): TypedContractMethod<[_omamoriAddress: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setOmamoriTokenIdOffset"
  ): TypedContractMethod<
    [_omamoriTokenIdOffset: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setOmamoriTypeCount"
  ): TypedContractMethod<
    [_omamoriTypeCount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "supportsInterface"
  ): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "tokenURI"
  ): TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "transferFrom"
  ): TypedContractMethod<
    [from: AddressLike, to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "Approval"
  ): TypedContractEvent<
    ApprovalEvent.InputTuple,
    ApprovalEvent.OutputTuple,
    ApprovalEvent.OutputObject
  >;
  getEvent(
    key: "ApprovalForAll"
  ): TypedContractEvent<
    ApprovalForAllEvent.InputTuple,
    ApprovalForAllEvent.OutputTuple,
    ApprovalForAllEvent.OutputObject
  >;
  getEvent(
    key: "Mint"
  ): TypedContractEvent<
    MintEvent.InputTuple,
    MintEvent.OutputTuple,
    MintEvent.OutputObject
  >;
  getEvent(
    key: "OtakiageEvent"
  ): TypedContractEvent<
    OtakiageEventEvent.InputTuple,
    OtakiageEventEvent.OutputTuple,
    OtakiageEventEvent.OutputObject
  >;
  getEvent(
    key: "SendAllOmamori"
  ): TypedContractEvent<
    SendAllOmamoriEvent.InputTuple,
    SendAllOmamoriEvent.OutputTuple,
    SendAllOmamoriEvent.OutputObject
  >;
  getEvent(
    key: "Transfer"
  ): TypedContractEvent<
    TransferEvent.InputTuple,
    TransferEvent.OutputTuple,
    TransferEvent.OutputObject
  >;

  filters: {
    "Approval(address,address,uint256)": TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;
    Approval: TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;

    "ApprovalForAll(address,address,bool)": TypedContractEvent<
      ApprovalForAllEvent.InputTuple,
      ApprovalForAllEvent.OutputTuple,
      ApprovalForAllEvent.OutputObject
    >;
    ApprovalForAll: TypedContractEvent<
      ApprovalForAllEvent.InputTuple,
      ApprovalForAllEvent.OutputTuple,
      ApprovalForAllEvent.OutputObject
    >;

    "Mint(address,uint256)": TypedContractEvent<
      MintEvent.InputTuple,
      MintEvent.OutputTuple,
      MintEvent.OutputObject
    >;
    Mint: TypedContractEvent<
      MintEvent.InputTuple,
      MintEvent.OutputTuple,
      MintEvent.OutputObject
    >;

    "OtakiageEvent(address[])": TypedContractEvent<
      OtakiageEventEvent.InputTuple,
      OtakiageEventEvent.OutputTuple,
      OtakiageEventEvent.OutputObject
    >;
    OtakiageEvent: TypedContractEvent<
      OtakiageEventEvent.InputTuple,
      OtakiageEventEvent.OutputTuple,
      OtakiageEventEvent.OutputObject
    >;

    "SendAllOmamori(address,uint256[],uint256[])": TypedContractEvent<
      SendAllOmamoriEvent.InputTuple,
      SendAllOmamoriEvent.OutputTuple,
      SendAllOmamoriEvent.OutputObject
    >;
    SendAllOmamori: TypedContractEvent<
      SendAllOmamoriEvent.InputTuple,
      SendAllOmamoriEvent.OutputTuple,
      SendAllOmamoriEvent.OutputObject
    >;

    "Transfer(address,address,uint256)": TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
    Transfer: TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
  };
}
